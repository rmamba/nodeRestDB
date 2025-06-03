pipeline {
    agent any

    environment {
        gitLabel = VersionNumber([
            projectStartDate: '2023-01-01',
            versionNumberString: "${params.gitLabel}",
            worstResultForIncrement: 'SUCCESS'
        ])
    }

    stages {
        stage('Build & Run tests') {
            steps {
                sh "docker run --rm --entrypoint /bin/ash -w /usr/src/app -v $WORKSPACE:/usr/src/app node:20-alpine test.sh"
            }
        }
        stage('Publish Test results') {
            steps {
                junit "junit.xml"
            }
        }
        stage('Docker:latest') {
            steps {
                sh "docker build --build-arg debug_mode=--no-dev -t rmamba/node-rest-db:latest ."
                sh "docker push rmamba/node-rest-db:latest"
            }
        }
        stage('Docker:20-alpine') {
            steps {
                sh "docker tag rmamba/node-rest-db:latest rmamba/node-rest-db:20-alpine"
                sh "docker push rmamba/node-rest-db:20-alpine"
                sh "docker rmi rmamba/node-rest-db:20-alpine"
            }
        }
        stage('Docker:tag') {
            steps {
                sh "docker tag rmamba/node-rest-db:latest rmamba/node-rest-db:20-alpine-${params.gitLabel}"
                sh "docker push rmamba/node-rest-db:20-alpine-${params.gitLabel}"
                sh "docker rmi rmamba/node-rest-db:20-alpine-${params.gitLabel}"
            }
        }
    }
}
