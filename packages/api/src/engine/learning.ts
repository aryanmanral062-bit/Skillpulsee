export interface LearningResource {
  title: string;
  description: string;
  resourceUrl: string;
  estimatedHours: number;
}

export interface LearningStep extends LearningResource {
  step: number;
  reason: string;
}

const LEARNING_MAP: Record<string, LearningResource> = {
  'testing': {
    title: 'Jest fundamentals — unit + integration testing',
    description: 'Learn to write reliable tests in Node.js with Jest',
    resourceUrl: 'https://jestjs.io/docs/getting-started',
    estimatedHours: 8
  },
  'docker': {
    title: 'Docker + Compose — containerising a Node.js service',
    description: 'Package and run apps consistently with Docker',
    resourceUrl: 'https://docs.docker.com/get-started/',
    estimatedHours: 6
  },
  'ci-cd': {
    title: 'CI/CD with GitHub Actions',
    description: 'Automate test and deploy pipelines',
    resourceUrl: 'https://docs.github.com/en/actions',
    estimatedHours: 5
  },
  'kubernetes': {
    title: 'Kubernetes core concepts',
    description: 'Deploy and manage containerised workloads',
    resourceUrl: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/',
    estimatedHours: 12
  },
  'typescript': {
    title: 'TypeScript for JavaScript developers',
    description: 'Add types to your JavaScript codebase',
    resourceUrl: 'https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html',
    estimatedHours: 10
  },
  'node': {
    title: 'Node.js official guides',
    description: 'Deep dive into Node.js architecture',
    resourceUrl: 'https://nodejs.org/en/docs/guides/',
    estimatedHours: 15
  },
  'react': {
    title: 'React documentation — Thinking in React',
    description: 'Master React functional components and hooks',
    resourceUrl: 'https://react.dev/learn',
    estimatedHours: 12
  },
  'postgresql': {
    title: 'PostgreSQL Tutorial',
    description: 'Master relational data modeling and querying',
    resourceUrl: 'https://www.postgresqltutorial.com/',
    estimatedHours: 10
  }
};

export function generateLearningPath(gaps: string[], windowDays: number): LearningStep[] {
  return gaps.map((gap, index) => {
    const resource = LEARNING_MAP[gap] || {
      title: `Deep dive into ${gap}`,
      description: `Search Pluralsight or Udemy for latest ${gap} courses`,
      resourceUrl: `https://www.udemy.com/courses/search/?q=${gap}`,
      estimatedHours: 10
    };

    return {
      step: index + 1,
      title: resource.title,
      description: resource.description,
      resourceUrl: resource.resourceUrl,
      estimatedHours: resource.estimatedHours,
      reason: `${gap} gap detected: minimal activity found compared to team average in ${windowDays}d window`
    };
  });
}
