#!/usr/bin/env groovy

def deploy (servers) {
    script {
        for (item in servers) {
            println "Deploying to ${item}."
            sh(script: """
	    whoami
            ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@'${item}' bash -c "'
                ./deploy-fe.sh
            '"
            """)
            sleep 20
            sh(script: """
            ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null ubuntu@'${item}' bash -c "'
                ss -tulpn | grep 3060
            '"
            """)
        }
    }
}

pipeline {
    agent any
    stages {
        stage ('Checkout') {
            steps {
                checkout scm: [
                    $class: 'GitSCM',
                    branches: scm.branches,
                    doGenerateSubmoduleConfigurations: scm.doGenerateSubmoduleConfigurations,
                    extensions: [[$class: 'CloneOption', noTags: false, shallow: false, depth: 0, reference: '']],
                    userRemoteConfigs: scm.userRemoteConfigs
                ]
            }
        }
        stage ('Deploy to dev') {
            when {
                branch 'dev'
            }
            steps {
                script {
                        def servers = ['10.217.128.26']
                        deploy (servers)
                    }
                }
			}
        stage ('Deploy to staging ') {
            when {
                branch 'staging'
            }
            steps {
                script {
                        def servers = ['10.217.128.20']
                        deploy (servers)
                    }
                }
			}
        stage ('Deploy to prod') {
            when {
                branch 'main'
            }
            steps {
                script {
                        def servers = ['10.217.128.22']
                        deploy (servers)
                }
            }
		}
	}
    post { 
        always { 
            echo 'I will always run!'
            office365ConnectorSend status: currentBuild.currentResult, webhookUrl: 'https://tuliptechcom.webhook.office.com/webhookb2/03416099-2273-4106-add3-48f502ff8caf@982780f8-0424-4e57-9cc0-bee3d6acc797/IncomingWebhook/93265587596646f988430acf2f978610/b85c9489-d2d0-4cc5-8056-59ecb87bc846'
        }
    }
}
