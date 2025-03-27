<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Reporte de KPI's</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

        /* Margen general para que header y footer no se solapen */
        @page {
            margin: 150px 25px; /* margen superior e inferior */
        }

        header {
            position: absolute;  /* Ya no es fixed */
            top: -20px; 
            left: 0;
            right: 0;
            height: 100px;
            text-align: center;
        }

        footer {
            position: absolute;  /* Ya no es fixed */
            bottom: -20px; 
            left: 0;
            right: 0;
            height: 100px;
            text-align: center;
        }

        .pagenum:before {
            content: "Página " counter(page);
        }

        body {
            font-family: 'Montserrat', sans-serif;
            font-size: 14px;
            margin: 0;
        }

        main {
            margin-top: 50px;
            margin-left: 94px;
            padding: 10px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            margin-top: 20px;
        }

        th,
        td {
            border: 1px solid #000;
            padding: 10px;
            text-align: center;
        }

        th {
            background-color: #d6fdff;
            font-weight: bold;
        }

        h1 {
            text-align: center;
            font-size: 18px;
            margin-bottom: 10px;
        }

        .firma img {
            margin-top: 10px;
            border: 1px solid #ddd;
            padding: 5px;
            border-radius: 10px;
        }

        .header-img,
        .footer-img {
            width: 100%;
            height: auto;
            max-height: 100px;
            object-fit: cover;
            display: block;
        }

        .text-rigth {
            text-align: right;
        }

        .tabladirma{
            margin: auto; 
            text-align: center; 
            border: none; 
            border-collapse: collapse;
        }
    </style>
</head>

<body>

    <header>
        <img src="{{ public_path('images/Membrete_Cartas.png') }}" alt="Header Logo" class="header-img">
    </header>

    <main>
        <p>Bogotá. D.C. marzo 25 de 2025</p>

        <p>Señor(a)</p>
        @php
            $primerElemento = $data[0] ?? [];
        @endphp
        <p>{{ $primerElemento['nombre_empleado'] ?? 'N/A' }}</p>

        <p class="text-rigth"><strong>Ref.: Aceptación de KPIs para el año 2025</strong></p>

        <p>Estimado/a {{ $primerElemento['nombre_empleado'] ?? 'N/A' }}</p>

        <p>Una vez definidos los objetivos del plan estratégico de su área, se presentan los siguientes KPIs definidos para el 2025:</p>
        <p>A continuación, se detallan los KPIs acordados para el periodo 2025:</p>

        <table>
            <thead>
                <tr>
                    <th>Identificación</th>
                    <th>Correo</th>
                    <th>Nombre Indicado</th>
                    <th>Descripción KPI</th>
                    <th>Peso Objetivo</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($data as $item)
                    <tr>
                        <td>{{ $item['identificacion_empleado'] ?? 'N/A' }}</td>
                        <td>{{ $item['correo_empleado'] ?? 'N/A' }}</td>
                        <td>{{ $item['nombre_indicado'] ?? 'N/A' }}</td>
                        <td>{{ $item['descripcion_kpi'] ?? 'N/A' }}</td>
                        <td>{{ $item['peso_objetivo'] ?? 'N/A' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <p>Estos indicadores han sido establecidos en alineación con los objetivos estratégicos de la empresa y servirán como base para la evaluación de su rendimiento.</p>

        <p>Mediante la firma de este documento, el colaborador expresa su aceptación y compromiso para cumplir con estos KPIs durante el periodo estipulado. Asimismo, el jefe inmediato confirma que los indicadores han sido revisados y acordados.</p>

        <p>Confirmo que he revisado y acepto los KPIs presentados en el informe correspondiente. Estoy de acuerdo con los objetivos establecidos y me comprometo a trabajar en colaboración para alcanzar los resultados esperados.</p>

        <p>Atentamente,</p>

        <div class="firma">
            <table class="tabladirma">
                <tr>
                    <td>
                        <p>Colaborador:</p>
                        @if($firmaBase64)
                            <p>{{ $primerElemento['nombre_empleado'] ?? 'N/A' }}</p>
                            <p>Firma:</p>
                            <img src="{{ $firmaBase64 }}" width="150">
                        @else
                            <p>No hay firma disponible</p>
                        @endif
                    </td>
                    <td>
                        <p>Jefe Inmediato:</p>
                        <p>Firma:</p>
                    </td>
                </tr>
            </table>
        </div>
    </main>

    <footer>
        <img src="{{ public_path('images/Pie de pagina.jpg') }}" alt="Footer Logo" class="footer-img">
    </footer>

</body>

</html>
