import { createTranslatedForms } from '../utils/create-translated-forms';

export type MontrealCognitiveAssessmentData = {
  abstraction: number;
  attention: number;
  delayedRecall: number;
  language: number;
  lowEdu: boolean;
  naming: number;
  orientation: number;
  visuospatialExecutive: number;
};

export const montrealCognitiveAssessment = createTranslatedForms<MontrealCognitiveAssessmentData>({
  content: {
    abstraction: {
      kind: 'numeric',
      label: {
        en: 'Abstraction',
        fr: 'Abstraction'
      },
      max: 2,
      min: 0,
      variant: 'default'
    },
    attention: {
      kind: 'numeric',
      label: {
        en: 'Attention',
        fr: 'Attention'
      },
      max: 6,
      min: 0,
      variant: 'default'
    },
    delayedRecall: {
      kind: 'numeric',
      label: {
        en: 'Delayed Recall',
        fr: 'Rappel'
      },
      max: 5,
      min: 0,
      variant: 'default'
    },
    language: {
      kind: 'numeric',
      label: {
        en: 'Language',
        fr: 'Langue'
      },
      max: 3,
      min: 0,
      variant: 'default'
    },
    lowEdu: {
      kind: 'binary',
      label: {
        en: 'Less Than 12 Years of Education',
        fr: "Moins de 12 ans d'études"
      },
      options: {
        en: {
          f: 'No',
          t: 'Yes'
        },
        fr: {
          f: 'No',
          t: 'Oui'
        }
      },
      variant: 'radio'
    },
    naming: {
      kind: 'numeric',
      label: {
        en: 'Naming',
        fr: 'Dénomination'
      },
      max: 3,
      min: 0,
      variant: 'default'
    },
    orientation: {
      kind: 'numeric',
      label: {
        en: 'Orientation',
        fr: 'Orientation'
      },
      max: 6,
      min: 0,
      variant: 'default'
    },
    visuospatialExecutive: {
      kind: 'numeric',
      label: {
        en: 'Visuospatial/Executive',
        fr: 'Visuospatial/Exécutif'
      },
      max: 5,
      min: 0,
      variant: 'default'
    }
  },
  details: {
    description: {
      en: 'The Montreal Cognitive Assessment (MoCA) was designed as a rapid screening instrument for mild cognitive dysfunction. It assesses different cognitive domains: attention and concentration, executive functions, memory, language, visuoconstructional skills, conceptual thinking, calculations, and orientation. The MoCA may be administered by anyone who understands and follows the instructions, however, only a health professional with expertise in the cognitive field may interpret the results. Time to administer the MoCA is approximately 10 minutes. The total possible score is 30 points; a score of 26 or above is considered normal.',
      fr: "Le Montreal Cognitive Assessment (MoCA) a été conçue comme un instrument de dépistage rapide des troubles cognitifs légers. Il évalue différents domaines cognitifs : l'attention et la concentration, les fonctions exécutives, la mémoire, le langage, les capacités visuoconstructives, la pensée conceptuelle, les calculs et l'orientation. Le MoCA peut être administré par toute personne qui comprend et suit les instructions, mais seul un professionnel de la santé spécialisé dans le domaine cognitif peut interpréter les résultats. L'administration du MoCA dure environ 10 minutes. Le score total possible est de 30 points ; un score de 26 ou plus est considéré comme normal."
    },
    estimatedDuration: 10,
    instructions: {
      en: 'All instructions may be repeated once.',
      fr: 'Toutes les instructions peuvent être répétées une fois.'
    },
    title: {
      en: 'Montreal Cognitive Assessment',
      fr: 'Montreal Cognitive Assessment'
    }
  },
  measures: {
    abstraction: {
      formula: {
        field: 'abstraction',
        kind: 'const'
      },
      label: {
        en: 'Abstraction',
        fr: 'Abstraction'
      }
    },
    attention: {
      formula: {
        field: 'attention',
        kind: 'const'
      },
      label: {
        en: 'Attention',
        fr: 'Attention'
      }
    },
    delayedRecall: {
      formula: {
        field: 'delayedRecall',
        kind: 'const'
      },
      label: {
        en: 'Delayed Recall',
        fr: 'Rappel'
      }
    },
    language: {
      formula: {
        field: 'language',
        kind: 'const'
      },
      label: {
        en: 'Language',
        fr: 'Langue'
      }
    },
    naming: {
      formula: {
        field: 'naming',
        kind: 'const'
      },
      label: {
        en: 'Naming',
        fr: 'Dénomination'
      }
    },
    orientation: {
      formula: {
        field: 'orientation',
        kind: 'const'
      },
      label: {
        en: 'Orientation',
        fr: 'Orientation'
      }
    },
    totalScore: {
      formula: {
        fields: [
          'abstraction',
          'attention',
          'delayedRecall',
          'language',
          'lowEdu',
          'naming',
          'orientation',
          'visuospatialExecutive'
        ],
        kind: 'sum',
        options: {
          coerceBool: true
        }
      },
      label: {
        en: 'Total Score',
        fr: 'Score total'
      }
    },
    visuospatialExecutive: {
      formula: {
        field: 'visuospatialExecutive',
        kind: 'const'
      },
      label: {
        en: 'Visuospatial/Executive',
        fr: 'Visuospatial/Exécutif'
      }
    }
  },
  name: 'MontrealCognitiveAssessment',
  tags: ['Cognitive'],
  validationSchema: {
    properties: {
      abstraction: {
        maximum: 2,
        minimum: 0,
        type: 'integer'
      },
      attention: {
        maximum: 6,
        minimum: 0,
        type: 'integer'
      },
      delayedRecall: {
        maximum: 5,
        minimum: 0,
        type: 'integer'
      },
      language: {
        maximum: 3,
        minimum: 0,
        type: 'integer'
      },
      lowEdu: {
        type: 'boolean'
      },
      naming: {
        maximum: 3,
        minimum: 0,
        type: 'integer'
      },
      orientation: {
        maximum: 6,
        minimum: 0,
        type: 'integer'
      },
      visuospatialExecutive: {
        maximum: 5,
        minimum: 0,
        type: 'integer'
      }
    },
    required: [
      'abstraction',
      'attention',
      'delayedRecall',
      'language',
      'naming',
      'orientation',
      'visuospatialExecutive'
    ],
    type: 'object'
  },
  version: 8.1
});