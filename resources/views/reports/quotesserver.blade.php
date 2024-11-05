<!doctype html>
<html lang="en">

<head>
    <!-- Required meta tags -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css"
        integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">

    <title>Cotizacion #1234564</title>
</head>

<body>
    <style>
        p {
            font-size: 12px !important;
        }
    </style>
    <header>
        <div class="d-flex flex-row">
            <p >{{ $dateQuote }}</p>
            <div>
                <img src="{{ public_path() . '/img/logo.jpg' }}" alt="" height="150" width="150" />
            </div>
            <div>
                <blockquote class="blockquote">
                    <h4 class="mb-0">Meltec Comunicaciones S.A</h4>
                    <p>Cotizacion # {{ $quotesserver->id }}</p>
                </blockquote>
            </div>
        </div>
    </header>

    <section>
        <p class="blockquote"><span class="font-weight-bold">Señores:</span> {{ $quotesserver->clientServer->client }}
        </p>

        <p class="blockquote"><span class="font-weight-bold">Asunto: </span>Propuesta economica</p>

        <p>Reciba un cordial saludo en nombre de MELTEC COMUNICACIONES S.A., compañía dedicada al suministro, integración y desarrollo de soluciones empresariales y movilidad digital en Colombia. A continuación, me permito enviarle nuestra cotización de acuerdo con sus requerimientos. Esperamos que esta propuesta cumpla con sus expectativas y estaremos atentos a sus comentarios </p>

        <table class="table text-center table-bordered">
            <thead>
              <tr>
                <th scope="col">Cantida de Nucleos</th>
                <th scope="col">Memoria Ram</th>
                <th scope="col">Almacenamiento</th>
                <th scope="col">Ancho de Banda</th>
                <th scope="col">Sistema Operativo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ $quotesserver->server->cpu_cores }} Vcores</td>
                <td>{{ $quotesserver->server->ram }} GB</td>
                <td>{{ $quotesserver->server->storage }} GB SSD</td>
                <td>{{ $quotesserver->server->bandwidth }} Mb/S</td>
                <td>{{ $quotesserver->server->os > 4 ? 'Windows Server' : 'Linux' }}</td>
              </tr>
            </tbody>
            <caption> Total del contrato ${{ $quotesserver->total_year }} - Tiempo del Contrato {{ $quotesserver->total_mounth }} Meses </caption>
          </table>

          <hr />

          <p>Tiempo de Entrega: 20 Días</p>
          <p>Forma de Pago: 30 Días</p>
          <p>Lugar de entrega: Bogotá</p>
          <p>Validez de la Oferta: 8 Días</p>
    </section>

    <footer></footer>
</body>

</html>
