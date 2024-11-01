# Comentarios sobre los diferentes campos para enviar por formato JSON a SAP

# IMPORTANTE!! -> La fecha para post en SAP debe estar en formato UNIX. Ejemplo: "/Date(1695328122)/" -> Fecha formateada a normal GMT: Thu Sep 21 2023 20:28:42 GMT+0000 

1. Campo "ClassificationCategoryCode" : ["Z11" => "Suministro", "Z5" => "Llamada en frio", "Z14" => "Suministro y Servicio", "Z8" => "Cliente Recurrente" ... (Los datos ya deben estar en Flokzu)] // Tipo de Clasificacion

2. Campo "PriorityCode" : ["1" => "Inmediata", "2" => "Urgente", "3" => "Normal"] Prioridad de la Oportunidad

3. Campo "SalesCycleCode" : ["001" => "Oportunidad Meltec"] # Importante: Para las oportunuidades este campo no debe cambiar

4. Campo "SalesPhaseCode" : ["003" => "*Desconocido*", "" => ""]

5. Campo "ResultReasonCode" : ["" => ""] Campo aun desconocido

6. Campo "ChanceOfSuccessPercent" : Porcentaje de Exito

7. Campo "ExpectedRevenueAmount" : Cantidad de la Oportunidad (Dinero)

8. Campo "ExpectedRevenueAmountCurrencyCode": ["COP" => "Peso Colombiano", "USD" => "Dolar"] Moneda

9. Campo "SalesRevenueForecastRelevanceIndicator" : [true] # Siempre en TRUE!!

10. Campo "EmployeeResponsible.PartyID" : Identificacion del Empleado responsable - Integrado en SAP

11. Campo "ProspectParty.PartyID" : Identificacion del Cliente en SAP

# Todas las oportunidades generadas mediante la api en la url "/opportunities" se generaran como Abiertas