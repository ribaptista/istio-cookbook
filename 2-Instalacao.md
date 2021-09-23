# Instalando o Istio

O Istio atua em um cluster de Kubernetes. 

Esta seção aborda a criação de um cluster de Kubernetes, bem como a instalação do Istio no cluster recém-criado.

## Conteúdo desta seção

* [Criando um cluster de Kubernetes](#criando_cluster)
* [Instalando o Istio](#instalando_istio)
* [Destruindo o cluster](#destruindo_cluster)
* [Próximos passos](#proximos_passos)

## <a name="criando_cluster"></a> Criando um cluster de Kubernetes

Neste passo usaremos a ferramenta `minikube`, instalada na seção anterior.

Em um terminal, inicialize um cluster de Kubernetes com o comando abaixo:

```console
ricardo@ricardo-A60-MUV:~$ minikube start -p istio-exemplos
😄  [istio-examplos] minikube v1.21.0 on Ubuntu 20.04
✨  Automatically selected the docker driver
👍  Starting control plane node istio-examplos in cluster istio-exemplos
🚜  Pulling base image ...
🎉  minikube 1.23.2 is available! Download it: https://github.com/kubernetes/minikube/releases/tag/v1.23.2
💡  To disable this notice, run: 'minikube config set WantUpdateNotification false'

🔥  Creating docker container (CPUs=2, Memory=7900MB) ...
🐳  Preparing Kubernetes v1.20.7 on Docker 20.10.7 ...
    ▪ Generating certificates and keys ...
    ▪ Booting up control plane ...
    ▪ Configuring RBAC rules ...
🔎  Verifying Kubernetes components...
    ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
🌟  Enabled addons: storage-provisioner, default-storageclass
🏄  Done! kubectl is now configured to use "istio-exemplos" cluster and "default" namespace by default
```

O parâmetro `-p istio-exemplos` atribui um nome de profile ao nosso cluster. Todas as próximas chamadas ao comando `minikube` devem também conter este parâmetro. 

A última linha (`kubectl is now configured...`) indica que o utilitário `kubectl` (também instalado na seção anterior) já foi configurado para se comunicar com o cluster `istio-exemplos`.

Ainda assim, podemos verificar a configuração do kubectl com o seguinte comando:

```console
ricardo@ricardo-A60-MUV:~$ kubectl config current-context
istio-exemplos
```

## <a name="instalando_istio"></a> Instalando o Istio

Existem várias formas de se instalar o Istio, mas a mais fácil é a partir do seu *Operator*.

Para instalar o operator do Istio em nosso cluster, vamos a usar a ferramenta `istioctl`, instalada na seção anterior.

Rode o comando abaixo:

```console
ricardo@ricardo-A60-MUV:~$ istioctl operator init
Installing operator controller in namespace: istio-operator using image: docker.io/istio/operator:1.11.2
Operator controller will watch namespaces: istio-system
✔ Istio operator installed                                                                                                                              
✔ Installation complete
```

### 💡 Dica
Como o comando `istioctl` sabe em qual cluster instalar o operator? 

O `istioctl` sempre usa a mesma configuração atribuída ao `kubectl`. 

Portanto, sendo o nosso cluster `istio-exemplos` o atualmente ativado no kubectl, este será o cluster onde o istioctl instalará o operator do Istio.

### Verificando a instalação

Podemos verificar a instalação do operator com os seguintes comandos:

```console
ricardo@ricardo-A60-MUV:~$ kubectl get svc --namespace istio-operator
NAME             TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)    AGE
istio-operator   ClusterIP   10.110.154.171   <none>        8383/TCP   5m33s
```

```console
ricardo@ricardo-A60-MUV:~$ kubectl get pod --namespace istio-operator 
NAME                             READY   STATUS    RESTARTS   AGE
istio-operator-6547bf56c-q94jr   1/1     Running   0          7m32s
```

Os valores `1/1` e `Running` na saída do comando acima indicam que o operator está em funcionamento.

### Completando a instalação

Para completar a instalação do operator, é necessário criar um _kubernetes resource_ do tipo `IstioOperator` em nosso cluster.

[Nesta pasta](code/2-Instalacao) há um exemplo básico de um IstioOperator. 

Para instalar o IstioOperator do exemplo, rode o comando abaixo dentro do diretório `code/2-Instalacao`:

```console
ricardo@ricardo-A60-MUV:~/istio-exemplos/code/2-Instalacao$ kubectl apply -f operator.yaml 
istiooperator.install.istio.io/default created
```

Pronto! O setup feito nesta seção é o suficiente para colocarmos em prática os exemplos das próximas seções.

## <a name="destruindo_cluster"></a>Destruindo o cluster

Você pode decidir destruir toda a instalação feita nesta seção, tanto para praticar novamente a criação de clusters como para limpar o ambiente ao fim do dia.

O cluster criado nesta seção pode ser completamente destruído (incluindo o operator do Istio) com o seguinte comando:

```console
ricardo@ricardo-A60-MUV:~$ minikube delete -p istio-exemplos
🔥  Deleting "istio-exemplos" in docker ...
🔥  Deleting container "istio-exemplos" ...
🔥  Removing /home/ricardo/.minikube/machines/istio-exemplos ...
💀  Removed all traces of the "istio-exemplos" cluster.
```

## <a name="proximos_passos"></a> Próximos passos
    
🥳️🥳️🥳️ Parabéns! Agora você sabe como instalar o Istio em um cluster. Nas próximas seções começaremos a explorar as funcionalidades do Istio.
