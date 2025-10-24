# Simple Express + SQLite Auth App

## Setup
- Install Node.js 18+.
- In PowerShell run:

```
npm install
```

## Run (development)
```
npm run dev
```
Open http://localhost:3000

## Run (production)
```
npm start
```

## Features
- Sign up with email + password (bcrypt hashed)
- Login, session via cookie
- Logout redirects to thank-you page
- SQLite file at `database.sqlite`


## To build docker Image
- run command: docker build -t (inoput name of the image)
- example: docker build -t tic4303-3pagewebapp

## Tag the image on docker file
- run command: docker tag (image name) (dokcer desktop id)/(image name):tag (refer to docker desktop image tag column)
- Example: docker tag tic4303-3pagewebapp e089xxxxxx/tic4303-3pagewebapp:latest

## Push the image to docker hub
- run command: docker push (docker desktop id)/(image name):tag
- Example: docker push e089xxxxxx/tic4303-3pagewebapp:latest

## Run the image in docker desktop terminal
- run command: docker run -d -p 3000:3000 --name (name you image file) (docker desktop id)/(image file name in docker hub)
- Example: docker run -d -p 3000:3000 --name tic4303-3pagewebapp e089xxxxx/tic4303-3pagewebapp

## Try to access the webapplication using local host link
- http://localhost:3000

## Kubernetes Deployment

### Prerequisites
- Install **kubectl** CLI: [Install kubectl](https://kubernetes.io/docs/tasks/tools/)
- Install a local Kubernetes cluster (Docker Desktop)
- Ensure your Docker image is available locally or in a registry accessible to Kubernetes

### Apply Deployment & Service
1. Make sure `webapp.yaml` exists (contains Deployment and Service)
2. Run: kubectl apply -f webapp.yaml


### Verify Deployment
kubectl get pods -n tic4303-dev
kubectl get svc -n tic4303-dev


- NodePort service will expose the app.  
- Access it in browser via: http://localhost:30080


---

## Notes
- PodSecurity is enabled in the namespace; your deployment uses securityContext for baseline compliance.
- Logs can be checked using: kubectl logs <pod-name> -n tic4303-dev

## Kubernetes Security Testing (Audit / Restricted Policy)

### Trigger a PodSecurity Audit
You can create a pod that intentionally violates the **restricted** policy to see audit warnings.

1. Apply the violation YAML: kubectl apply -f restricted-violation.yaml

2. Expected behavior:
- The pod will still be created (baseline is enforced).
- You will see warnings in your terminal like: Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "test-container" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "test-container" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "test-container" must set securityContext.runAsNonRoot=true), runAsUser=0 (container "test-container" must not set runAsUser=0), seccompProfile (pod or container "test-container" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")

Clean up
After testing, you can delete the violating pod: kubectl delete pod restricted-violation-test -n tic4303-dev



