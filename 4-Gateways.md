# Utilizando o Istio como gateway

Na [seção anterior](3-Servicos.md) instalamos e inicializamos três microsserviços que compõe a nossa aplicação de exemplo: *users*, *movies* e *dashboard*.

Porém constatamos que tais serviços não são acessíveis de fora do cluster, pois foram configurados para assumir o tipo `ClusterIP`.

Normalmente, este é mesmo a configuração desejada em clusters do mundo real: os vários microsserviços 
são configurados para atender requests originados diretamente de dentro do cluster apenas.

Para expor os serviços externamente, para serem capazes de atender requests vindos da Internet (ou no nosso caso, vindos do nosso
localhost, através do comando `curl`), iremos aplicar a funcionalidade de gateway do Istio.

## Conteúdo desta seção

...

## <a name="para_que_serve"></a> Para que serve um gateway?

Um *gateway* (do inglês "porta de entrada", ou "portal") é um serviço rodando em nosso cluster que é exposto externamente. 

Portanto, o gateway possui um IP acessível de fora do cluster.

O propósito do gateway é concentrar em si todos os requests para a aplicação, e por sua vez destinar tais requests para
os devidos microsserviços rodando internamente no cluster.

![Diagrama de gateway](img/4-Gateway.png)

## <a name="instalacao"></a> Instalação do gateway

Este repositório contém [este diretório](https://github.com/ribaptista/istio-exemplos/tree/main/code/4-Gateway) com toda a configuração
necessária para criar um gateway no Istio.
