# 📦 Instalando a aplicação de exemplo

As funcionalidades do Istio são melhor entendidas quando aplicadas em uma aplicação presente no cluster.

Nesta seção o cluster criado na seção anterior será populado com uma aplicação de exemplo.

## 📋 Conteúdo desta seção

* [Sobre a aplicação de exemplo](#sobre)
* [Build das imagens da aplicação](#build)
* [Instalando a aplicação de exemplo](#instalando)
* [Testando a aplicação](#testando)
* [Próximos passos](#proximos_passos)

## <a name="sobre"></a> Sobre a aplicação de exemplo

Este repositório contém uma aplicação de exemplo [neste diretório](https://github.com/ribaptista/istio-exemplos/tree/main/services).

Trata-se de uma aplicação simples que simula um serviço de recomendação de filmes.

A aplicação é composta por três microsserviços: 

* **users**: retorna informações sobre o usuário logado
* **movies**: lida com dados de filmes, bem como recomendações de filmes para o usuário logado
* **dashboard**: um serviço agregador, que reúne informações dos dois serviços acima

## <a name="ferramentas"></a> 🔧 Ferramentas necessárias

Para instalar os três microsserviços apresentados acima em nosso cluster, usaremos as ferramentas `minikube`, `docker-compose` e `kubectl`,
todas instaladas na [primeira seção](1-Ferramentas.md) deste material.

## <a name="build"></a> 📦 Build das imagens da aplicação

Para rodar a aplicação de exemplo no cluster, cada um dos três microsserviços que a compõem deve estar previamente empacotado em uma imagem docker.

Além disso, tais imagens devem estar presentes no *registry* (registry) do custer de kubernetes onde a aplicação será instalada.

A etapa de criação de imagens docker chama-se *etapa de build*.

Para fazer o build das imagens da aplicação, siga os passos abaixo:

Em um shell, entre no diretório `services/` deste repositório:

```console
ricardo@ricardo-A60-MUV:~/istio-exemplos$ cd services/
```

Agora configure o comando docker para guardar as imagens que serão criadas diretamente no registry do cluster gerenciado pelo minikube:

```console
ricardo@ricardo-A60-MUV:~/istio-exemplos/services$ eval $(minikube -p istio-exemplos docker-env)
```

Faça o build das imagens dos microsserviços com o seguinte comando:

```console
ricardo@ricardo-A60-MUV:~/istio-exemplos/services$ docker-compose build 
```

A etapa acima pode demorar alguns minutos, pois algumas imagens de dependências serão baixadas da Internet.

Certifique-se que o build das imagens foi bem sucedido listando as imagens presentes no registry:

```console
ricardo@ricardo-A60-MUV:~/istio-exemplos/services$ docker image ls
REPOSITORY                                TAG        IMAGE ID       CREATED         SIZE
services_dashboard                        latest     964f3547c5dd   25 hours ago    915MB
services_movies                           latest     109ad900164b   25 hours ago    914MB
services_users                            latest     d318530fcc1b   25 hours ago    913MB
...
```

As imagens `services_dashboard`, `services_movies` e `services_users` devem constar na lista de imagens do registry.

## <a name="instalando"></a> ⚙️ Instalando a aplicação de exemplo

Com as imagens dos microsserviços agora disponíveis no registry do cluster do minikube é possível agora rodar a aplicação.

Ainda no diretório `services/`, mude para o subdiretório `k8s`:

```console
ricardo@ricardo-A60-MUV:~/istio-exemplos/services$ cd k8s/
```

Rode o `kubectl` para instalar todos os três microsserviços no cluster do minikube:

```console
ricardo@ricardo-A60-MUV:~/istio-exemplos/services/k8s$ kubectl apply -k .
namespace/dashboard created
namespace/movies created
namespace/users created
service/dashboard created
service/movies created
service/users created
deployment.apps/dashboard created
deployment.apps/movies created
deployment.apps/users created
```

Rode os três comandos abaixo para conferir o status dos microsserviços no cluster:

```console
ricardo@ricardo-A60-MUV:~/istio-exemplos/services/k8s$ kubectl get pods -n users 
NAME                     READY   STATUS    RESTARTS   AGE
users-59654ff8ff-xq8kb   1/1     Running   0          3m35s
ricardo@ricardo-A60-MUV:~/istio-exemplos/services/k8s$ kubectl get pods -n movies
NAME                      READY   STATUS    RESTARTS   AGE
movies-84f78594d4-pcvvl   1/1     Running   0          3m38s
ricardo@ricardo-A60-MUV:~/istio-exemplos/services/k8s$ kubectl get pods -n dashboard
NAME                        READY   STATUS    RESTARTS   AGE
dashboard-f9dd87b74-fxxxr   1/1     Running   0          3m42s
```

Os valores `1/1` na coluna `READY` e `Running` na coluna `STATUS` indicam que todos os microsserviços estão em funcionamento e prontos para atender requests.

## <a name="testando"></a> 💣 Testando a aplicação

Com a aplicação devidamente inicializada, prosseguiremos para fazer requests aos seus microsserviços.

Verifique o IP atribuído ao serviço de usuários que acabamos de instalar:

```console
ricardo@ricardo-A60-MUV:~/istio-exemplos/services/k8s$ kubectl get svc users -n users
NAME    TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
users   ClusterIP   10.98.155.147   <none>        80/TCP    9m4s
```

O IP `10.98.155.147` acima é interno ao cluster, ou seja, só pode ser resolvido por conexões partindo de dentro do cluster.

Assim o seguinte comando `curl`, partindo do nosso host (portanto externo ao cluster), falhará:

```console
ricardo@ricardo-A60-MUV:~/istio-exemplos/services/k8s$ curl --connect-timeout 1 http://10.98.155.147
curl: (28) Connection timed out after 1001 milliseconds
```

Já o valor `<none>` na colune `EXTERNAL-IP` indica que serviço não possui um IP para conexões partindo de fora do cluster.

Com isso podemos concluir que este microsserviço não é, por si só, acessível a partir de fora do cluster. Esta é a característica de um serviço do tipo `ClusterIP`.

O mesmo ocorre com os outros dois microsserviços, *movies* e *dashboard*, por também possuem o mesmo tipo de serviço `ClusterIP` (você consegue deduzir os comandos para realizar o mesmo teste que fizemos acima para os outros dois microsserviços?)

Na próxima seção introduziremos o Istio para fazer o papel de *gateway*, ou *BFF (backend for frontend)*, para expor os três microsserviços para acesso externo.

Por ora, podemos usar uma função de *debug* do kubectl para acessar o serviço *users* temporariamente:

No shell, rode:

```console
ricardo@ricardo-A60-MUV:~/istio-exemplos/services/k8s$ kubectl port-forward svc/users -n users 3000:80
Forwarding from 127.0.0.1:3000 -> 80
Forwarding from [::1]:3000 -> 80
```

Mantenha o comando acima rodando, abra um terminal paralelo e rode:

```console
ricardo@ricardo-A60-MUV:~$ curl http://localhost:3000/profile
{"id":101,"name":"John Doe","birthday":"1985-07-15","email":"johndoe@email.com"}
```

No comando acima acessamos o *path* `/profile` do serviço *users*, que retorna (ou simula) as informações de perfil do usuárío logado.

### 🦾 Desafio

Tente utilizar o mesmo comando `kubectl port-forward` que utilizamos acima, porém para testar os demais serviços *movies* e *dashboard*.

O serviço *movies* possui os paths `/top` e `/recommended/user/101`.

Já o serviço *dashboard* possuir o path `/main`.

## <a name="proximos_passos"></a> 👉 Próximos passos

Parabéns! Com a aplicação de exemplo rodando no cluster, temos o cenário necessário para começar a explorar as funcionalidades do Istio na próxima seção.

