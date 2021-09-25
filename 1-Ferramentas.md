# 🧰️ Instalando as ferramentas necessárias

Esta seção aborda as ferramentas necessárias para rodar os exemplos deste material.

Os procedimentos a seguir foram testados no Ubuntu Linux, mas podem também funcionar em outras distribuições do Linux.

### 📋 Conteúdo desta seção

* [Instalando o minikube](#minikube)
* [Instalando o docker](#docker)
* [Instalando o docker-compose](#docker-compose)
* [Instalando o kubectl](#kubectl)
* [Instalando o istioctl](#istioctl)
* [Próximos passos](#proximos_passos)

### <a name="minikube"></a> 🛠 Instalando o minikube

O Istio é uma solução que roda em um cluster de Kubernetes.

Nesta série de exemplos usaremos a ferramenta [minikube](https://minikube.sigs.k8s.io/docs/) para rodar um cluster de Kubernetes localmente.

Rode os comandos abaixo para instalar o minikube:

```shell
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

Verifique se o minikube foi instalado corretamente (o número de versão e o commit provavelmente serão diferentes da saída abaixo):

```console
ricardo@ricardo-A60-MUV:~$ minikube version
minikube version: v1.21.0
commit: 76d74191d82c47883dc7e1319ef7cebd3e00ee11
```

### <a name="docker"></a> 🛠 Instalando o docker

O [docker](https://www.docker.com/) é uma ferramenta para manipulação de imagens e containers. 

Uma vez que toda aplicação rodando em um cluster de Kubernetes é baseada em containers e imagens, o docker será essencial para o setup de nosso ambiente.

Para instalar o docker, rode os seguintes comandos:

```shell
sudo apt-get remove docker docker-engine docker.io containerd runc
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

Verifique que o docker foi instalado corretamente com o seguinte comando:

```console
ricardo@ricardo-A60-MUV:~$ docker version
```

O comando acima deverá emitir informações como a versão do docker e suas dependências.

### <a name="docker"></a> 🛠 Instalando o docker-compose

O [docker-compose](https://docs.docker.com/compose/) estende a funcionalidade do `docker`, permitindo manipular várias imagens e containers com um único comando.

Para instalar o docker-compose, rode os comandos abaixo:

```
ricardo@ricardo-A60-MUV:~$ sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
ricardo@ricardo-A60-MUV:~$ sudo chmod +x /usr/local/bin/docker-compose
```

Confira que a instalação foi bem sucedida com o comando:

```console
ricardo@ricardo-A60-MUV:~$ docker-compose --version
docker-compose version 1.29.2, build 5becea4c
```

### <a name="kubectl"></a> 🛠 Instalando o kubectl

O [kubectl](https://kubernetes.io/docs/reference/kubectl/kubectl/) é uma ferramenta de linha de comando (CLI) para administração de clusters de Kubernetes.

Rode os comandos abaixo para instalar o kubectl:

```shell
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

Verifique que a instalação do kubectl completou com sucesso (os números de versão podem variar dos mostrados abaixo):

```console
ricardo@ricardo-A60-MUV:~$ kubectl version --client
Client Version: version.Info{Major:"1", Minor:"21", GitVersion:"v1.21.1", GitCommit:"5e58841cce77d4bc13713ad2b91fa0d961e69192", GitTreeState:"clean", BuildDate:"2021-05-12T14:18:45Z", GoVersion:"go1.16.4", Compiler:"gc", Platform:"linux/amd64"}
```

### <a name="istioctl"></a> 🛠 Instalando o istioctl

O [istioctl](https://istio.io/latest/docs/setup/install/istioctl/) é um utilitário de linha de comando (CLI) que facilita a instalação e configuração do Istio.

Rode os seguintes comandos para baixar e instalar a versão 1.11.2 do istioctl:

```shell
curl -O https://storage.googleapis.com/istio-release/releases/1.11.2/istioctl-1.11.2-linux-amd64.tar.gz
tar zxfv istioctl-1.11.2-linux-amd64.tar.gz
sudo install istioctl /usr/local/bin/
```

Verifique se o istioctl foi instalado corretamente:

```console
ricardo@ricardo-A60-MUV:~/tmp$ istioctl version
no running Istio pods in "istio-system"
1.11.2
```

### <a name="proximos_passos"></a> ⏭ Próximos passos

 Pronto! 🎉🎉🎉  
 
 Com as ferramentas instaladas, podemos prosseguir para a próxima seção, onde criaremos um cluster local de Kubernetes onde o Istio será instalado.
