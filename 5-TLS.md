# 🔒 Criptografando a conexão com TLS

Até agora configuramos o Istio para servir uma aplicação respondendo no domínio `my-sample-app.io`.

Na seção anterior utilizamos o protocolo HTTP em todos os requests feitos com o comando `curl` à aplicação
(isto pode ser facilmente verificado pela porção inicial das URLs dos requests: `http://`)

O protocolo HTTP trafega os dados entre o usuário e a aplicação em um canal não-criptografado, possibilitando
que terceiros possam inadvertidamente ler o conteúdo tanto do request quanto do response, colocando em
risco a privacidade do usuário.

Nesta seção faremos uma sutil alteração na configuração do gateway criado na seção anterior para
instruir o Istio a servir nossa aplicação através do protocolo HTTPS.

O protocolo HTTPS é o protocolo padrão utilizado por sites e aplicações atualmente.

Utilizando uma camada de criptografia chamada TLS, o protocolo HTTPS impede o roubo dos dados em trânsito entre
o usuário e a aplicação.

## 📋 Conteúdo desta seção

* [Alterando o gateway ativar o TLS](#alterando_gateway)
* [Configuração de TLS no gateway](#configuracao)
* [Manipulando chaves e certificados TLS no Istio](#chaves_certificados)
* [Próximos passos](#proximos_passos)

## <a name="alterando_gateway"></a> ✅ Alterando o gateway ativar o TLS

Este repositório contém um exemplo de gateway com TLS habilitado [neste diretório](https://github.com/ribaptista/istio-exemplos/tree/main/code/5-TLS).

Podemos aplicar o conteúdo deste diretório diretamente sobre a instalação feita na seção anterior: o gateway existente será atualizado com a nova configuração.

Em um terminal, acesse o diretório `code/5-TLS` e digite:

```console
ricardo@ricardo-A60-MUV:~/istio-exemplos/code/5-TLS$ kubectl apply -k .
secret/server-tls created
gateway.networking.istio.io/my-sample-app configured
```

A mensagem da última linha indica que o gateway existente foi atualizado com as novas configurações (`configured`).

Antes de entrar em detalhes sobre o conteúdo dos arquivos deste diretório, vamos primeiro testar as alterações que acabamos de fazer.

## 🧑‍🔬 Testando o protocolo HTTPS

Da mesma forma que na seção anterior, uma vez que estamos utilizando o minikube como implementação de kubernetes,
é necessário expor o gateway do Istio ao nosso host.

Em um terminal, digite:

```console
ricardo@ricardo-A60-MUV:~$ minikube tunnel -p istio-exemplos
```

Mantenha o processo rodando e, em um terminal paralelo, vamos enviar requests HTTPS à aplicação com o comando abaixo:

```console
ricardo@ricardo-A60-MUV:~$ curl -k --resolve "my-sample-app.io:443:10.100.236.210" https://my-sample-app.io/users/profile
{"id":101,"name":"John Doe","birthday":"1985-07-15","email":"johndoe@email.com"}
```

Se a saída do comando foi a mesma exibida acima, o protocolo HTTPS/TLS está habilitado no gateway do Istio. 
Toda comunicação entre o Istio e o mundo externo está segura!

### 🧠 Entendendo o comando acima

O comando `curl` rodado acima possui três diferenças em relação aos requests inseguros (HTTP) que enviamos na seção anterior.

Você consegue identificar as diferenças?

1. O protocolo usado na URL agora é `https://`, e não mais `http://`
2. A porta usada no parâmetro `--resolve` agora é `443` (a porta padrão do protocolo HTTPS)
3. Foi introduzido o parâmetro `-k`. Discutiremos este parâmetro mais adiante.

## <a name="configuracao"></a> 🪛 Configuração de TLS no gateway 

Ao compararmos o conteúdo do [arquivo de configuração do gateway](code/5-TLS/gateway.yaml) desta seção com
o do [arquivo da seção anterior](code/4-Gateway/gateway.yaml) identificamos as seguintes diferenças:

* Os parâmetros da chave `port` mudaram para referir-se à porta TLS (`HTTPS:8443`) do ingress gateway;
* Há uma nova chave, chamada `tls`. A subchave `credentialName` aponta para um *kubernetes secret* contendo 
a chave privada e o certificado desta configuração de TLS.

## <a name="chaves_certificados"></a> 🔐 Manipulando chaves e certificados TLS no Istio

Toda aplicação servida no protocolo HTTPS necessita de dois valores especiais: uma chave privada (*private key*) e um certificado.

Não é diferente para a nossa aplicação de exemplo. 
Você pode conferir a private key e o certificado que utilizamos nesta seção no arquivo [server-tls.yaml](code/5-TLS/server-tls.yaml).

No arquivo YAML acima, a chave `tls.crt` contém o certificado, e a chave `tls.key` contém a chave privada.

### 🛑🤚 Brecha de segurança!

Tanto a private key como o certificado do nosso exemplo foram declaradas em plain-text e versionadas neste repositório.

Esta prática só é valida por se tratar de um cenário didático, de exemplo.

A private key e o certificado de uma aplicação devem ser tratados como dados sensíveis, portanto nunca devem ser versionados em um repositório.

Ao invés disso, utilize um gerenciador de segredos (como o Vault ou GitHub secrets) para armazenar as configurações de TLS de sua aplicação.

## 🖋 Usando um certificado auto-assinado

O certificado deste exemplo foi gerado por [este](https://www.selfsignedcertificate.com/) site.

Trata-se de um certificado auto-assinado, ou *self-signed*. 

Certificados self-signed são suficientes para validarmos que a aplicação está utilizando o protocolo HTTPS, 
mas não são suficientes para uma aplicação real, pois não são capazes de provar a autenticidade da aplicação.

Assim, o parâmetro `-k` do comando `curl` acima desliga a verificação de autenticidade do certificado provido
pela aplicação. Contudo, esta prática só é aceitável em cenários experimentais e didáticos.

Aplicações reais utilizam certificados emitidos por autoridades de certificação, como os certificados emitidos
pelos serviços Let's Encrypt e Certificate Manager da AWS.

### 🐛 Desafio: detectando erros de validação de certificado

Envie o mesmo comando `curl` acima, mas desta vez omitindo o parâmetro `-k`.

Você consegue agora identificar o motivo da mensagem de erro exibida?

## <a name="proximos_passos"></a> 🏃‍♀️ Próximos passos

Parabéns! Agora toda comunicação entre o usuário final e a nossa aplicação ocorre em um canal seguro. 
Na próxima seção exploraremos as técnicas de autenticação e autorização de usuários oferecidas pelo Istio.
