import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from 'testcontainers';
import * as path from 'path';

import { Nullable } from '../../modules/shared/types';

export let instance: Nullable<StartedDockerComposeEnvironment>;

export const startDocker = async () => {
  const composeFilePath = path.resolve(__dirname);
  const composeFile = 'docker-compose.yml';

  const environment: StartedDockerComposeEnvironment =
    await new DockerComposeEnvironment(composeFilePath, composeFile).up();

  instance = environment;
  globalThis.__DOCKER_ENVIRONMENT__ = environment;
};

export const stopDocker = async () => {
  if (!instance) {
    return;
  }

  try {
    await instance.down();
    instance = null;
  } catch (e) {
    console.log('Failed to stop docker-compose', e);
  }
};

export const getRunningEnvironment = () => {
  if (!instance) {
    instance = globalThis.__DOCKER_ENVIRONMENT__;
  }

  if (!instance) {
    throw new Error('Docker environment is not running');
  }

  return instance;
};
