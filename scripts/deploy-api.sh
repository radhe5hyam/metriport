#!/usr/bin/env bash

# Run from the root of the repository.

if [[ -z "${AWS_REGION}" ]]; then
  echo "AWS_REGION is missing"
  exit 1
fi
if [[ -z "${ECR_REPO_URI}" ]]; then
  echo "ECR_REPO_URI is missing"
  exit 1
fi
if [[ -z "${ECS_CLUSTER}" ]]; then
  echo "ECS_CLUSTER is missing"
  exit 1
fi
if [[ -z "${ECS_SERVICE}" ]]; then
  echo "ECS_SERVICE is missing"
  exit 1
fi

# Fail on error
set -e

# Echo commands
set -x

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO_URI

GITHUB_SHA=$(git rev-parse --short HEAD)

# Build server tarball
tar \
  --exclude='**/*.ts' \
  --exclude='**/__tests__' \
  --exclude='**/*.spec*' \
  --exclude='**/*.test*' \
  --exclude='**/metriport-api.tar.gz' \
  -czf api/app/metriport-api.tar.gz \
  package.json \
  package-lock.json \
  api/app/package.json \
  api/app/dist

pushd api/app/

# Build and push Docker images
docker buildx build \
  --platform linux/amd64,linux/arm64,linux/arm/v7 \
  --tag "$ECR_REPO_URI:latest" \
  --tag "$ECR_REPO_URI:$GITHUB_SHA" \
  --push \
  .

popd

# Build and push Docker images
source ./scripts/restart-api.sh