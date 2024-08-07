import React, { useState } from 'react';

import { Button, DropdownMenu } from '@douglasneuroinformatics/libui/components';
import { EllipsisVerticalIcon } from 'lucide-react';

import { useAppStore } from '@/store';

import { DeleteInstrumentDialog } from './DeleteInstrumentDialog';
import { RestoreDefaultsDialog } from './RestoreDefaultsDialog';
import { UserSettingsDialog } from './UserSettingsDialog';

export const ActionsDropdown = () => {
  const [showUserSettingsDialog, setShowUserSettingsDialog] = useState(false);
  const [showDeleteInstrumentDialog, setShowDeleteInstrumentDialog] = useState(false);
  const [showRestoreDefaultsDialog, setShowRestoreDefaultsDialog] = useState(false);

  const selectedInstrument = useAppStore((store) => store.selectedInstrument);

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button className="h-9 w-9" size="icon" variant="outline">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          {window.__GITHUB_REPO_URL__ && (
            <React.Fragment>
              <DropdownMenu.Item asChild>
                <a
                  className="flex w-full cursor-pointer items-center disabled:cursor-not-allowed disabled:opacity-50"
                  href={window.__GITHUB_REPO_URL__}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>GitHub</span>
                </a>
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
            </React.Fragment>
          )}
          <DropdownMenu.Item asChild onSelect={() => setShowUserSettingsDialog(true)}>
            <button className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" type="button">
              User Settings
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item asChild onSelect={() => setShowDeleteInstrumentDialog(true)}>
            <button
              className="w-full cursor-pointer text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
              disabled={selectedInstrument.category !== 'Saved'}
              type="button"
            >
              Delete Instrument
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item asChild onSelect={() => setShowRestoreDefaultsDialog(true)}>
            <button
              className="w-full cursor-pointer text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
              type="button"
            >
              Restore Defaults
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
      <UserSettingsDialog isOpen={showUserSettingsDialog} setIsOpen={setShowUserSettingsDialog} />
      <DeleteInstrumentDialog isOpen={showDeleteInstrumentDialog} setIsOpen={setShowDeleteInstrumentDialog} />
      <RestoreDefaultsDialog isOpen={showRestoreDefaultsDialog} setIsOpen={setShowRestoreDefaultsDialog} />
    </React.Fragment>
  );
};
