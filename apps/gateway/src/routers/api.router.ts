import { type EncryptResult, HybridCrypto } from '@douglasneuroinformatics/libcrypto';
import { $CreateRemoteAssignmentData, $UpdateAssignmentData } from '@opendatacapture/schemas/assignment';
import type { AssignmentStatus, MutateAssignmentResponseBody } from '@opendatacapture/schemas/assignment';
import type { GatewayHealthcheckSuccessResult } from '@opendatacapture/schemas/gateway';
import { Router } from 'express';

import { prisma } from '@/lib/prisma';
import { ah } from '@/utils/async-handler';
import { HttpException } from '@/utils/http-exception';

const router = Router();

router.get(
  '/assignments',
  ah(async (req, res) => {
    let subjectId: string | undefined;
    if (typeof req.query.subjectId === 'string') {
      subjectId = req.query.subjectId;
    }
    const assignments = await prisma.remoteAssignmentModel.findMany({
      where: {
        subjectId
      }
    });
    return res.status(200).json(
      assignments.map(({ encryptedData, symmetricKey, ...assignment }) => {
        return {
          ...assignment,
          encryptedData: encryptedData ? Array.from(encryptedData) : null,
          status: assignment.status as AssignmentStatus,
          symmetricKey: symmetricKey ? Array.from(symmetricKey) : null
        };
      })
    );
  })
);

router.post(
  '/assignments',
  ah(async (req, res) => {
    const result = await $CreateRemoteAssignmentData.safeParseAsync(req.body);
    if (!result.success) {
      throw new HttpException(400, 'Bad Request');
    }
    const { instrumentContainer, publicKey, ...assignment } = result.data;
    await prisma.remoteAssignmentModel.create({
      data: {
        ...assignment,
        instrumentBundle: instrumentContainer.bundle,
        instrumentId: instrumentContainer.id,
        instrumentKind: instrumentContainer.kind,
        rawPublicKey: Buffer.from(publicKey)
      }
    });
    res.status(201).send({ success: true } satisfies MutateAssignmentResponseBody);
  })
);

router.patch(
  '/assignments/:id',
  ah(async (req, res) => {
    const id = req.params.id;
    const assignment = await prisma.remoteAssignmentModel.findFirst({
      where: { id }
    });
    if (!assignment) {
      throw new HttpException(404, `Failed to Find Assignment with ID: ${id}`);
    }
    const result = await $UpdateAssignmentData.safeParseAsync(req.body);
    if (!result.success) {
      console.error(result.error);
      throw new HttpException(400, 'Bad Request');
    }
    const { data, expiresAt, status } = result.data;
    const publicKey = await assignment.getPublicKey();

    let encryptResult: EncryptResult | null = null;
    if (!encryptResult) {
      encryptResult = await HybridCrypto.encrypt({
        plainText: JSON.stringify(data),
        publicKey
      });
    }

    await prisma.remoteAssignmentModel.update({
      data: {
        completedAt: result.data.data ? new Date() : undefined,
        encryptedData: encryptResult ? Buffer.from(encryptResult.cipherText) : null,
        expiresAt,
        status: data ? ('COMPLETE' satisfies AssignmentStatus) : status,
        symmetricKey: encryptResult ? Buffer.from(encryptResult.symmetricKey) : null
      },
      where: {
        id: assignment.id
      }
    });
    res.status(200).json({ success: true } satisfies MutateAssignmentResponseBody);
  })
);

router.delete(
  '/assignments/:id',
  ah(async (req, res) => {
    const id = req.params.id;
    const assignment = await prisma.remoteAssignmentModel.findFirst({
      where: { id }
    });
    if (!assignment) {
      throw new HttpException(404, `Failed to Find Assignment with ID: ${id}`);
    }
    await prisma.remoteAssignmentModel.delete({
      where: { id }
    });
    res.status(200).json({ success: true } satisfies MutateAssignmentResponseBody);
  })
);

router.get('/healthcheck', (_, res) => {
  res.status(200).json({
    ok: true,
    releaseInfo: import.meta.env.RELEASE_INFO,
    status: 200,
    uptime: Math.round(process.uptime())
  } satisfies GatewayHealthcheckSuccessResult);
});

export { router as apiRouter };
