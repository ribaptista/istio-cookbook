# Instalando os serviços de exemplo

As funcionalidades do Istio são melhor entendidas quando aplicadas em uma aplicação presente no cluster.

Nesta seção o cluster criado na seção anterior será populado com uma aplicação de exemplo.

## Conteúdo desta seção

* [Sobre a aplicação de exemplo](#sobre)
* [Instalando a aplicação de exemplo](#instalando)

## <a name="sobre"></a> Sobre a aplicação de exemplo

Este repositório contém uma aplicação de exemplo [neste diretório](https://github.com/ribaptista/istio-exemplos/tree/main/services).

A aplicação é composta por três microsserviços: 

* **users**: retorna informações sobre o usuário logado
* **movies**: lida com dados de filmes, bem como recomendações de filmes para o usuário logado
* **dashboard**: um serviço agregador, que reúne informações dos dois serviços acima

## <a name="instalando"></a> Instalando a aplicação de exemplo

Para instalar os três microsserviços apresentados acima em nosso cluster, usaremos as ferramentas `minikube`, `docker-compose` e `kubectl`,
todas instaladas na [primeira seção](1-Ferramentas.md) deste material.



