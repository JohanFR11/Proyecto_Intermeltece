export const CLIENT_INITIAL_VALUES = {
  nameClient: '',
  email: '',
  phone: '',
  identification: ''
}

export const SERVER_INITIAL_VALUES = {
  cpuCores: 0,
  ram: 0,
  storage: 0,
  bandwidth: 0,
  backup: 0,
  security: 1,
  support: 1,
  snapchot: 1,
  so: 0,
  sql2core: 0,
  rdp: 0,
  ip: 0,
  sql2extra: 0,
  rdpExtra: 0
}

export const DISCOUNTS = [
  { value: 10, label: '1 Año' },
  { value: 20, label: '2 Años' },
  { value: 30, label: '3 Años' },
  { value: 40, label: '4 Años' }
]

export const TABLE_HEADER = ['Fecha de Cotización', 'Nombre del cliente', 'Duracion del contracto', 'Total USD/MES', 'Total USD/AÑO', 'Archivo']

export const TABLE_TOKENS_HEADER = ['#', 'Nombre del Token', 'Fecha de Creación', 'Acciones']

export const ROLES_CONSTANTS = {
  Admin: 'Administrador',
  Director: 'Director',
  'Usuario corriente': 'Usuario corriente',
  Hseq: 'Hseq - Gestion'
}

export const TABLE_KPIS_HEADER = ['Nombre del Informe', 'Url', 'Acciones']

export const THEADS_USERS = ['Avatar', 'Id', 'Nombre de Usuario', 'Correo Electronico', 'Rol de Usuario', 'Acciones']

export const THEADS_PARTS = ['Producto', 'Precio ($USD)', 'Precio a dia de hoy ($COP)', 'Acciones']

export const THEADS_PAYMENTS = ['Id de la transaccion', 'Fecha de la transaccion', 'Usuario', 'Medio de Pago - Banco', 'Monto']
