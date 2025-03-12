export const ArrowDown = () => {
  return (
    <svg
      className='ml-2 -mr-0.5 h-4 w-4'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 20 20'
      fill='currentColor'
    >
      <path
        fillRule='evenodd'
        d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
        clipRule='evenodd'
      />
    </svg>
  )
}

export const ViewIcon = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
      <path d='M12 15a3 3 0 100-6 3 3 0 000 6z' />
      <path fillRule='evenodd' d='M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z' clipRule='evenodd' />
    </svg>
  )
}

export const EditIcon = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
      <path d='M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z' />
      <path d='M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z' />
    </svg>
  )
}

export const AddIcon = () => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-6 h-6'>
      <path fillRule='evenodd' d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z' clipRule='evenodd' />
    </svg>
  )
}

export const NotificationIcon = ({ size, height, width, ...props }) => {
  return (
    <svg
      fill='none'
      height={size || height || 24}
      viewBox='0 0 24 24'
      width={size || width || 24}
      xmlns='http://www.w3.org/2000/svg'
      {...props}
    >
      <path
        clipRule='evenodd'
        d='M18.707 8.796c0 1.256.332 1.997 1.063 2.85.553.628.73 1.435.73 2.31 0 .874-.287 1.704-.863 2.378a4.537 4.537 0 01-2.9 1.413c-1.571.134-3.143.247-4.736.247-1.595 0-3.166-.068-4.737-.247a4.532 4.532 0 01-2.9-1.413 3.616 3.616 0 01-.864-2.378c0-.875.178-1.682.73-2.31.754-.854 1.064-1.594 1.064-2.85V8.37c0-1.682.42-2.781 1.283-3.858C7.861 2.942 9.919 2 11.956 2h.09c2.08 0 4.204.987 5.466 2.625.82 1.054 1.195 2.108 1.195 3.745v.426zM9.074 20.061c0-.504.462-.734.89-.833.5-.106 3.545-.106 4.045 0 .428.099.89.33.89.833-.025.48-.306.904-.695 1.174a3.635 3.635 0 01-1.713.731 3.795 3.795 0 01-1.008 0 3.618 3.618 0 01-1.714-.732c-.39-.269-.67-.694-.695-1.173z'
        fill='currentColor'
        fillRule='evenodd'
      />
    </svg>
  )
}

export const BackIcon = ({ size, ...props }) => {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path d='M4 12H20M4 8H20M4 16H12' stroke='#000000' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
    </svg>
  )
}

export const HomeIcon = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' {...props}><path fill='currentColor' d='M4 21V9l8-6l8 6v12h-6v-7h-4v7H4Z' /></svg>
  )
}

export const DatacenterIcon = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' {...props}><path fill='currentColor' d='M4 1h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1m0 8h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1m0 8h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1M9 5h1V3H9v2m0 8h1v-2H9v2m0 8h1v-2H9v2M5 3v2h2V3H5m0 8v2h2v-2H5m0 8v2h2v-2H5Z' /></svg>
  )
}

export const ReportIcon = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 2048 2048' {...props}><path fill='currentColor' d='M1792 549v1499H256V0h987l549 549zm-512-37h293l-293-293v293zm384 1408V640h-512V128H384v1792h1280zm-768-512h256v384H896v-384zm-384-256h256v640H512v-640zm768-256h256v896h-256V896z' /></svg>
  )
}

export const ToolIcon = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' {...props}><path fill='currentColor' d='M1 1h22v17H1V1Zm2 2v13h18V3H3Zm7.406 3.844L8.28 9.5l2.125 2.656l-1.562 1.25L5.719 9.5l3.125-3.906l1.562 1.25Zm4.75-1.25L18.281 9.5l-3.125 3.906l-1.562-1.25L15.72 9.5l-2.125-2.656l1.562-1.25ZM3.222 21h17.556v2H3.222v-2Z' /></svg>
  )
}

export const DownloadIcon = ({ size, ...props }) => {
  return (
    <svg viewBox='0 0 24 24' width={size} height={size} fill='none' xmlns='http://www.w3.org/2000/svg' {...props}><g id='SVGRepo_bgCarrier' strokeWidth='0' /><g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' /><g id='SVGRepo_iconCarrier'> <path d='M17 17H17.01M17.4 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H6.6M12 15V4M12 15L9 12M12 15L15 12' stroke='#000000' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' /> </g></svg>
  )
}

export const SellerIcon = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 15 15' {...props}><path fill='currentColor' d='M14 6H1a11.431 11.431 0 0 1 1-4h11a11.429 11.429 0 0 1 1 4zM3 7h9v6h-1V8H8v5H3zm1 3h3V8H4z' /></svg>
  )
}

export const HumanIcon = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' {...props}><path fill='currentColor' d='M7 2c-1.1 0-2 .9-2 2s.9 2 2 2s2-.89 2-2s-.89-2-2-2M5 7c-1.11 0-2 .89-2 2v6h2v7h5V11.6l2.53 4.4h2.44L16 14.66V22h4v-5h1v-3c0-1.11-.89-2-2-2h-2.5c-.6 0-1.13.26-1.5.68c-.33.42-.68.88-1 1.32h-.31L10 7.66C9.84 7.38 9.22 7 8.5 7H5m13 1c-.83 0-1.5.67-1.5 1.5S17.17 11 18 11s1.5-.67 1.5-1.5S18.83 8 18 8Z' /></svg>
  )
}

export function PermissionIcon({ size, color, ...props }) {
  return (
    <svg fill={color} width={size} height={size} viewBox='0 0 1920 1920' xmlns='http://www.w3.org/2000/svg' {...props}><g id='SVGRepo_bgCarrier' strokeWidth='0' /><g id='SVGRepo_tracerCarrier' strokeLinecap='round' strokeLinejoin='round' /><g id='SVGRepo_iconCarrier'> <path d='M1707 1760c0 29.44-23.893 53.333-53.333 53.333h-320c-29.44 0-53.334-23.893-53.334-53.333v-266.667H1707V1760ZM213.667 1484.053V1337.6c0-86.613 56.426-162.133 140.48-187.947 182.826-56 373.12-82.24 562.346-82.986 146.88.746 292.8 19.413 436.267 54.4-44.053 39.04-72.427 95.466-72.427 158.933v106.667h-106.666v288.32c-87.467 20.266-176.96 31.68-266.667 31.68-144.427 0-423.467-29.334-693.333-222.614ZM1387 1280c0-58.773 47.893-106.667 106.667-106.667 58.773 0 106.666 47.894 106.666 106.667v106.667H1387V1280ZM899.533 106.667h14.934c174.08 0 322.346 122.56 357.653 290.24-30.187 17.493-61.44 29.76-115.52 29.76-69.547 0-101.12-19.947-141.227-45.227-45.653-28.8-97.28-61.44-196.906-61.44-100.374 0-152.32 32.747-198.187 61.653-26.773 16.96-49.813 31.467-82.987 39.147 25.28-177.28 178.134-314.133 362.24-314.133Zm807.467 1280V1280c0-61.653-26.667-116.8-68.587-155.733l.107-.107c-37.867-43.733-123.093-69.76-146.88-76.267-100.373-30.826-202.88-53.013-306.453-67.626C1306.893 894.72 1387 753.813 1387 594.133h-106.667c0 201.707-164.16 365.867-365.866 365.867h-14.934c-201.706 0-365.866-164.16-365.866-365.867v-64.32c66.24-9.173 106.88-34.773 143.573-57.92 40.107-25.28 71.787-45.226 141.227-45.226 68.693 0 100.16 19.84 139.946 45.013 45.867 28.907 97.814 61.653 198.187 61.653 100.373 0 152.533-33.066 202.453-64.746l28.267-18.027-3.84-33.28C1355.427 179.413 1153.72 0 914.467 0h-14.934C638.947 0 427 211.947 427 480v114.133c0 159.787 80.107 300.694 201.92 386.24-103.36 14.507-205.653 36.587-306.133 67.307C193.72 1087.36 107 1203.84 107 1337.6v200.213l21.333 15.894C429.453 1779.627 745.4 1813.333 907 1813.333c90.453 0 180.48-11.52 268.907-30.506 11.306 77.333 77.333 137.173 157.76 137.173h320c88.213 0 160-71.787 160-160v-373.333H1707Z' fillRule='evenodd' /> </g></svg>
  )
}

export const TrashIcon = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' {...props}><path fill='currentColor' d='M9 3v1H4v2h1v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1V4h-5V3H9m0 5h2v9H9V8m4 0h2v9h-2V8Z' /></svg>
  )
}

export const PaymentIcon = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' {...props}><path fill='currentColor' d='M3 20q-.825 0-1.413-.588T1 18V7h2v11h17v2H3Zm4-4q-.825 0-1.413-.588T5 14V6q0-.825.588-1.413T7 4h14q.825 0 1.413.588T23 6v8q0 .825-.588 1.413T21 16H7Zm2-2q0-.825-.588-1.413T7 12v2h2Zm10 0h2v-2q-.825 0-1.413.588T19 14Zm-5-1q1.25 0 2.125-.875T17 10q0-1.25-.875-2.125T14 7q-1.25 0-2.125.875T11 10q0 1.25.875 2.125T14 13ZM7 8q.825 0 1.413-.588T9 6H7v2Zm14 0V6h-2q0 .825.588 1.413T21 8Z' /></svg>
  )
}

export const AccountingIcon = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 50 50' {...props}><path fill='currentColor' d='M41 1H9C6.8 1 5 2.8 5 5v40c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4V5c0-2.2-1.8-4-4-4zM17 41c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-1c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v1zm0-8c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-1c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v1zm0-8c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-1c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v1zm12 16c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-1c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v1zm0-8c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-1c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v1zm0-8c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-1c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v1zm12 16c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-1c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v1zm0-8c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-1c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v1zm0-8c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-1c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v1zm0-9c0 1.1-.9 2-2 2H11c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h28c1.1 0 2 .9 2 2v8z' /></svg>
  )
}

export const VerticalMenu = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' {...props}><path fill='none' stroke='currentColor' strokeLinejoin='round' strokeWidth='3.75' d='M12 12h.01v.01H12zm0-7h.01v.01H12zm0 14h.01v.01H12z' /></svg>
  )
}

export const LeftMenu = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' {...props}><path fill='currentColor' d='M15 18h-1.5l-6-6l6-6H15v12m-4.67-6L13 14.67V9.33L10.33 12Z' /></svg>
  )
}

export const RigthMenu = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' {...props}><path fill='currentColor' d='M9 6h1.5l6 6l-6 6H9V6m4.67 6L11 9.33v5.34L13.67 12Z' /></svg>
  )
}

export const UserIcon = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 256 256' {...props}><g fill='currentColor'><path d='M192 96a64 64 0 1 1-64-64a64 64 0 0 1 64 64Z' opacity='.2' /><path d='M230.92 212c-15.23-26.33-38.7-45.21-66.09-54.16a72 72 0 1 0-73.66 0c-27.39 8.94-50.86 27.82-66.09 54.16a8 8 0 1 0 13.85 8c18.84-32.56 52.14-52 89.07-52s70.23 19.44 89.07 52a8 8 0 1 0 13.85-8ZM72 96a56 56 0 1 1 56 56a56.06 56.06 0 0 1-56-56Z' /></g></svg>
  )
}

export const LogoutIcon = ({ size, ...props }) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24' {...props}><path fill='currentColor' d='M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h7v2H5v14h7v2H5Zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5l-5 5Z' /></svg>
  )
}

export const DocumentIcon = ({ size, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 256 256"
      {...props}
    >
      <g fill="currentColor">
        <path d="M208 80v120a16 16 0 0 1-16 16H64a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16h72l56 56Z" opacity=".2" />
        <path d="M200 72h-48V32H64a24.07 24.07 0 0 0-24 24v144a24.07 24.07 0 0 0 24 24h128a24.07 24.07 0 0 0 24-24V88ZM160 40.48L191.52 72H160ZM208 200a16 16 0 0 1-16 16H64a16 16 0 0 1-16-16V56a16 16 0 0 1 16-16h72v48a8 8 0 0 0 8 8h48Z" />
      </g>
    </svg>
  )
}

export function LearnIcon({ size, color, ...props }) {
  return (
    <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
      width={size} height={size} viewBox="0 0 512.000000 512.000000" {...props}
      preserveAspectRatio="xMidYMid meet">

      <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
        fill={color} stroke="none">
        <path d="M2405 5106 c-507 -101 -810 -611 -653 -1096 87 -270 295 -471 575
          -557 78 -23 104 -26 233 -26 129 0 155 3 233 26 291 89 495 293 584 584 23 78
          26 104 26 233 0 129 -3 155 -26 233 -89 291 -296 498 -584 583 -110 32 -282
          41 -388 20z"/>
        <path d="M1800 3244 c-124 -60 -275 -157 -355 -228 l-50 -44 25 -10 c383 -146
          1130 -422 1142 -422 11 0 913 334 1133 420 l30 12 -49 44 c-74 68 -228 166
          -356 228 -63 31 -121 56 -128 56 -7 0 -49 -20 -95 -44 -327 -177 -722 -179
          -1062 -6 -54 27 -103 50 -109 50 -6 0 -63 -25 -126 -56z"/>
        <path d="M879 2777 c-62 -41 -69 -69 -69 -274 l0 -183 45 0 c211 0 400 -152
          444 -358 14 -69 15 -514 0 -584 -16 -77 -74 -180 -129 -232 -82 -77 -205 -126
          -315 -126 l-45 0 0 -170 c0 -183 7 -216 51 -257 14 -12 339 -139 784 -306
          l760 -285 3 1131 c1 622 -1 1134 -5 1138 -5 4 -322 124 -706 268 -515 192
          -710 261 -741 261 -28 0 -55 -8 -77 -23z"/>
        <path d="M3415 2535 l-700 -263 -3 -1136 -2 -1136 77 29 c778 288 1453 547
          1472 564 44 41 51 74 51 257 l0 170 -45 0 c-211 0 -400 152 -444 358 -15 69
          -15 514 0 584 19 88 58 158 124 223 88 87 201 135 320 135 l45 0 0 183 c0 205
          -7 233 -69 274 -65 44 -71 42 -826 -242z"/>
        <path d="M663 2005 c-102 -31 -176 -96 -222 -195 -22 -46 -26 -69 -26 -140 0
          -76 4 -93 33 -152 38 -77 92 -130 171 -166 46 -22 74 -27 162 -30 128 -5 176
          13 209 78 18 36 20 58 20 270 0 212 -2 234 -20 270 -31 61 -78 80 -192 79 -51
          0 -112 -6 -135 -14z"/>
        <path d="M4188 2000 c-23 -12 -46 -36 -58 -60 -18 -36 -20 -59 -20 -270 0
          -212 2 -234 20 -270 33 -65 81 -83 210 -78 95 3 112 6 172 36 77 38 130 92
          167 171 22 47 26 70 26 141 0 71 -4 94 -26 141 -37 79 -90 133 -167 171 -61
          30 -75 33 -177 36 -95 2 -115 -1 -147 -18z"/>
      </g>
    </svg>
  )
};
