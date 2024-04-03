# PassIN

PassIn é uma aplicação de **gestão de participantes em eventos presenciais**
A ferramenta permite que o organizador cadastre um evento e abre uma página pública de inscrição.
Os participantes podem emitir uma credencial para check-in no dia de evento.
O Sistema fará um scam da credencial do participante para permitir a entrada no evento.

## Requisitos

### Requisitos Funcionais

- [] O organizador deve poder cadastrar um evento;
- [] O organizador deve poder visualizar dados de um evento;
- [] O organizador deve poder visualizar a lista de participantes de um evento;
- [] O Participante deve poder se inscrever em um evento;
- [] O Participante deve poder visualizar seu crachá de inscrição;
- [] O Participante deve poder fazer check-in no evento;

### Regras de Negócio

- [] O participante só pode se inscrever em um evento uma única vez;
- [] O participante só pode se inscrever em eventos com vagas disponíveis;
- [] O participante só pode realizar check-in em um evento uma única vez;

### Requisitos Não Funcionais

- [] O check-in no evento será realizado através de um QRCODE;