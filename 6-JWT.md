# Autenticação de usuário com JWT

A autenticação de usuários através de *JSON Web Tokens* (ou JWT) tornou-se um padrão para as aplicações atuais por sua simplicidade e flexibilidade.

Nesta seção demonstraremos mais uma funcionalidade do Istio: a camada de autenticação de usuário final utilizando tokens JWT.

## Conteúdo desta seção

* [Breve explicação sobre JWTs](#breve_explicacao)


## <a name="breve_explicacao"></a> Breve explicação sobre JWTs

JWTs são tokens emitidos por um servidor de autenticação imediatamente após o login de um usuário.

O token emitido é então enviado pelo frontend em todas as requisições para o backend aplicação final. 

Apenas requisições contendo tokens legítimos e dentro do prazo de expiração são consideradas pela aplicação final. 

Requisições desprovidas do token ou contendo tokens inválidos são imediatamente recusadas com o código HTTP `401` (Unauthorized) ou `403` (Forbidden).

Este repositório contém alguns exemplos de JWTs [neste diretório](https://github.com/ribaptista/istio-exemplos/tree/main/code/6-JWT/samples) 
que utilizaremos adiante para testar a camada de autenticação do Istio.

JWTs sempre carregam consigo a assinatura criptográfica do servidor de autenticação que os emitiu, tornando virtualmente impossível a sua falsificação 
(desde que tanto o servidor de autenticação quanto a aplicação final tenham sido configurados corretamente). 

A assinatura de um JWT é determinada pela *private key* utilizada pelo servidor de autenticação. 

A aplicação final verifica a autenticidade de um JWT através de uma *public key* disponibilizada publicamente pelo servidor de aplicação em uma URL conhecida.

Assim, apenas a *private key* é capaz de assinar um JWT, enquanto que a *public key* é apenas capaz de verificar a assinatura de um JWT.

## <a name="habilitando"></a> Habilitando a autenticação na aplicação exemplo

Partiremos do estado em que se encontra nossa aplicação na [seção anterior](5-TLS.md) para ativar a autenticação por JWT no microsserviço *users*.

Em um terminal, acesse o diretório `code/6-JWT` e digite o comando abaixo:

```console
ricardo@ricardo-A60-MUV:~/istio-exemplos/code/6-JWT$ kubectl apply -f auth-users.yaml 
requestauthentication.security.istio.io/jwt-auth created
authorizationpolicy.security.istio.io/jwt-auth created
```

Pronto! Antes de analisarmos o conteúdo do arquivo `auth-users.yaml` aplicado no comando acima, 
vamos primeiro testar a autenticação ativada no microsserviço *users*.

## <a name="preparando"></a> Preparando o ambiente para os testes

Assim como nas seções anteriores, é necessário iniciar o comando de túnel do minikube para podemos acessar a aplicação.

Em um terminal, digite:

```console
ricardo@ricardo-A60-MUV:~$ minikube tunnel -p istio-exemplos
```

Mantenha este comando rodando durante toda a duração dos testes.

## <a name="testando"></a> Testando a autenticação

Por simplicidade, para os testes de autenticação a seguir utilizaremos alguns JWTs estáticos presentes 
[neste diretório](https://github.com/ribaptista/istio-exemplos/tree/main/code/6-JWT/samples) 
do repositório.

Entretanto, ao final desta seção você aprenderá como debugar o conteúdo de JWTs e como criar seus próprios JWTs! 

### Cenário 1: Request anônimo

Neste primeiro cenário, enviaremos à aplicação um request anônimo, ou seja, desprovido de um token JWT. 

Este request é idêntico ao utilizado na seção anterior para testar a camada de TLS da aplicação.

```console
ricardo@ricardo-A60-MUV:~$ curl -k --resolve "my-sample-app.io:443:10.100.236.210" -w "\n%{http_code}\n" https://my-sample-app.io/users/profile
RBAC: access denied
403
```

Se você recebeu o código de erro `403` (Forbidden) como a saída exibida acima, o Istio já está protegendo o microsserviço *users* contra requests não-autenticados!

### Cenário 2: Enviando um token válido

Agora testaremos um cenário de sucesso. 

Envie a mesma requisiçao anterior, porém acrescentando [este token válido](https://raw.githubusercontent.com/ribaptista/istio-exemplos/main/code/6-JWT/samples/valid.jwt)
no header `Authorization` da requisição:

```console
ricardo@ricardo-A60-MUV:~$ curl -H "Authorization: Bearer $(curl https://raw.githubusercontent.com/ribaptista/istio-exemplos/main/code/6-JWT/samples/valid.jwt -s)" -k --resolve "my-sample-app.io:443:10.100.236.210" -w "\n%{http_code}\n" https://my-sample-app.io/users/profile
{"id":101,"name":"John Doe","birthday":"1985-07-15","email":"johndoe@email.com"}
200
```

O código `200` (OK) e o JSON com os dados de profile do usuário recebidos na saída acima indicam que o Istio 
reconheceu a legitimidade do token e assim permitiu o acesso ao microsserviço *users*.  

### Cenário 3: Token expirado

Por motivos de segurança, todo token emitido por servidores de autenticação incluem um metadado chamado `exp`, que representa
o timestamp (data e hora) de expiração do token.

Aplicações finais não devem aceitar requests portando tokens expirados (tokens cuja propriedade `exp` sejam anteriores à data e hora do request). 

No exemplo abaixo a requisição carrega [um token expirado](https://raw.githubusercontent.com/ribaptista/istio-exemplos/main/code/6-JWT/samples/expired.jwt):

```console
ricardo@ricardo-A60-MUV:~$ curl -H "Authorization: Bearer $(curl https://raw.githubusercontent.com/ribaptista/istio-exemplos/main/code/6-JWT/samples/expired.jwt -s)" -k --resolve "my-sample-app.io:443:10.100.236.210" -w "\n%{http_code}\n" https://my-sample-app.io/users/profile
Jwt is expired
401
```

A mensagem `Jwt is expired` retornada pelo Istio indica que nossa aplicação está protegida contra tokens expirados.

### Cenário 4: Token falsificado

Retomaremos aqui os conceitos de *private* e *public keys* introduzidos no início desta seção.

Os tokens utilizados nos cenários anteriores (token válido e token expirado) foram assinados com [esta private key](https://github.com/ribaptista/istio-exemplos/blob/main/code/6-JWT/keys/jwt.key), 
incluída neste repositório por motivos puramente didáticos.

No arquivo [auth-users.yaml](https://github.com/ribaptista/istio-exemplos/blob/main/code/6-JWT/auth-users.yaml), aplicado no início
desta seção para habilitar a autenticação no microsserviço *users*, configuramos o Istio a validar a autenticidade da assinatura de
tokens JWT na linha abaixo:

```yaml
  jwtRules:
    - issuer: "my-auth-server.io"
      jwksUri: https://raw.githubusercontent.com/ribaptista/istio-exemplos/main/code/6-JWT/jwks/jwks.json
```

O campo `jwtkUri` é normalmente uma URL exposta públicamente na Internet pelo serviço de autenticação, e contém a *public key* capaz de
verificar a assinatura dos JWTs emitidos pelo serviço de autenticação.

No exemplo abaixo, vamos testar o envio [deste token](https://raw.githubusercontent.com/ribaptista/istio-exemplos/main/code/6-JWT/samples/fake.jwt) que, embora bem-formado, foi emitido por um serviço de autenticação estranho à aplicação,
e portanto foi assinado por uma *private key* diferente da esperada pela *public key* configurada no Istio:

```console
ricardo@ricardo-A60-MUV:~$ curl -H "Authorization: Bearer $(curl https://raw.githubusercontent.com/ribaptista/istio-exemplos/main/code/6-JWT/samples/fake.jwt -s)" -k --resolve "my-sample-app.io:443:10.100.236.210" -w "\n%{http_code}\n" https://my-sample-app.io/users/profile
Jwt verification fails
401
```

Assim, constatamos pelo retorno do comando acima que o Istio bloqueia qualquer tentativa de acesso que não inclua um
token JWT emitido e assinado pelo servidor de autenticação de confiança da aplicação.





