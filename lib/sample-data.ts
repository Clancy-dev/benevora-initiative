// Sample data for testing and demonstration
// Replace with localStorage or API calls for production

export const sampleCompany = {
  id: 'company-1',
  name: 'Digital Solutions Inc',
  email: 'contact@digitalsolutions.com',
  logo: '/logo.png',
  // logo: null, // Replace with actual logo URL from UploadThing
  contacts: [
    {
      name: 'John Doe',
      email: 'john@digitalsolutions.com',
      phone: '+1 (555) 123-4567',
    },
    {
      name: 'Jane Smith',
      email: 'jane@digitalsolutions.com',
      phone: '+1 (555) 234-5678',
    },
  ],
}

export const sampleReceipt = {
  id: 'receipt-1',
  companyId: 'company-1',
  customerName: 'Acme Corporation',
  customerNames: ['John Client', 'Jane Executive'],
  customerEmail: 'contact@acmecorp.com',
  customerEmails: ['john@acmecorp.com', 'jane@acmecorp.com'],
  customerOrganization: 'Acme Corporation',
  clientContacts: [
    {
      name: 'John Client',
      email: 'john@acmecorp.com',
      phone: '+1 (555) 987-6543',
    },
    {
      name: 'Jane Executive',
      email: 'jane@acmecorp.com',
      phone: '+1 (555) 876-5432',
    },
  ],
  projectName: 'E-commerce Platform Development',
  serviceType: 'Website Development',
  projectStartDate: new Date('2024-01-15'),
  projectEndDate: new Date('2024-03-15'),
  description: 'Development of a full-stack e-commerce platform with payment integration',
  projectTotal: 5000,
  amountPaid: 3000,
  remainingBalance: 2000,
  currency: 'USD',
  paymentMethod: 'Bank',
  bankName: 'First National Bank',
  bankAccountNumber: 'ACC-123456789',
  cardNumber: null,
  mobileMoneyProvider: null,
  mobileNumber: null,
  countryCode: '+1',
  createdAt: new Date('2024-02-01'),
  updatedAt: new Date('2024-02-15'),
}

export const sampleReceipts = [
  sampleReceipt,
  {
    id: 'receipt-2',
    companyId: 'company-1',
    customerName: 'Tech Innovations Ltd',
    customerNames: ['Mike Johnson'],
    customerEmail: 'contact@techinnovations.com',
    customerEmails: ['mike@techinnovations.com'],
    customerOrganization: 'Tech Innovations Ltd',
    clientContacts: [
      {
        name: 'Mike Johnson',
        email: 'mike@techinnovations.com',
        phone: '0700123456',
      },
    ],
    projectName: 'Mobile App Development',
    serviceType: 'Web System',
    projectStartDate: new Date('2024-02-01'),
    projectEndDate: new Date('2024-04-30'),
    description: 'Custom mobile application with React Native',
    projectTotal: 8000,
    amountPaid: 4000,
    remainingBalance: 4000,
    currency: 'UGX',
    paymentMethod: 'Mobile Money',
    bankName: null,
    bankAccountNumber: null,
    cardNumber: null,
    mobileMoneyProvider: 'MTN Momo',
    mobileNumber: '0700123456',
    countryCode: '+256',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-18'),
  },
  {
    id: 'receipt-3',
    companyId: 'company-1',
    customerName: 'Creative Agency',
    customerNames: ['Sarah Williams'],
    customerEmail: 'hello@creativeagency.com',
    customerEmails: ['sarah@creativeagency.com'],
    customerOrganization: 'Creative Agency',
    clientContacts: [
      {
        name: 'Sarah Williams',
        email: 'sarah@creativeagency.com',
        phone: '0702987654',
      },
    ],
    projectName: 'Brand Identity Design',
    serviceType: 'Graphics Design',
    projectStartDate: new Date('2024-01-20'),
    projectEndDate: new Date('2024-02-28'),
    description: 'Complete brand identity package including logo, colors, and guidelines',
    projectTotal: 2500,
    amountPaid: 2500,
    remainingBalance: 0,
    currency: 'USD',
    paymentMethod: 'Cash',
    bankName: null,
    bankAccountNumber: null,
    cardNumber: null,
    mobileMoneyProvider: null,
    mobileNumber: null,
    countryCode: '+1',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-28'),
  },
]

export const sampleAuditLogs = [
  {
    id: 'log-1',
    receiptId: 'receipt-1',
    action: 'created',
    changedFields: [
      'customerName',
      'projectName',
      'projectTotal',
      'amountPaid',
      'paymentMethod',
    ],
    oldValues: {},
    newValues: {
      customerName: 'Acme Corporation',
      projectName: 'E-commerce Platform Development',
      projectTotal: 5000,
      amountPaid: 3000,
      paymentMethod: 'Bank',
    },
    changedAt: new Date('2024-02-01T10:30:00'),
  },
  {
    id: 'log-2',
    receiptId: 'receipt-1',
    action: 'edited',
    changedFields: ['amountPaid', 'remainingBalance'],
    oldValues: {
      amountPaid: 2500,
      remainingBalance: 2500,
    },
    newValues: {
      amountPaid: 3000,
      remainingBalance: 2000,
    },
    changedAt: new Date('2024-02-10T14:15:00'),
  },
  {
    id: 'log-3',
    receiptId: 'receipt-1',
    action: 'edited',
    changedFields: ['bankAccountNumber'],
    oldValues: {
      bankAccountNumber: 'ACC-123456788',
    },
    newValues: {
      bankAccountNumber: 'ACC-123456789',
    },
    changedAt: new Date('2024-02-15T09:45:00'),
  },
  {
    id: 'log-4',
    receiptId: 'receipt-2',
    action: 'created',
    changedFields: ['customerName', 'projectName', 'projectTotal', 'currency'],
    oldValues: {},
    newValues: {
      customerName: 'Tech Innovations Ltd',
      projectName: 'Mobile App Development',
      projectTotal: 8000,
      currency: 'UGX',
    },
    changedAt: new Date('2024-02-10T11:20:00'),
  },
  {
    id: 'log-5',
    receiptId: 'receipt-2',
    action: 'edited',
    changedFields: ['amountPaid', 'mobileNumber'],
    oldValues: {
      amountPaid: 3000,
      mobileNumber: '0700123455',
    },
    newValues: {
      amountPaid: 4000,
      mobileNumber: '0700123456',
    },
    changedAt: new Date('2024-02-18T16:30:00'),
  },
  {
    id: 'log-6',
    receiptId: 'receipt-3',
    action: 'created',
    changedFields: ['customerName', 'projectName', 'projectTotal'],
    oldValues: {},
    newValues: {
      customerName: 'Creative Agency',
      projectName: 'Brand Identity Design',
      projectTotal: 2500,
    },
    changedAt: new Date('2024-01-25T13:00:00'),
  },
  {
    id: 'log-7',
    receiptId: 'receipt-3',
    action: 'edited',
    changedFields: ['amountPaid', 'remainingBalance'],
    oldValues: {
      amountPaid: 1500,
      remainingBalance: 1000,
    },
    newValues: {
      amountPaid: 2500,
      remainingBalance: 0,
    },
    changedAt: new Date('2024-02-28T17:45:00'),
  },
]

// Uncomment below to enable localStorage usage in future versions
/*
export const useCompanyData = () => {
  const [company, setCompany] = React.useState(() => {
    const stored = localStorage.getItem('company')
    return stored ? JSON.parse(stored) : sampleCompany
  })

  const saveCompany = (data: typeof sampleCompany) => {
    localStorage.setItem('company', JSON.stringify(data))
    setCompany(data)
  }

  return { company, saveCompany }
}

export const useReceiptData = () => {
  const [receipts, setReceipts] = React.useState(() => {
    const stored = localStorage.getItem('receipts')
    return stored ? JSON.parse(stored) : [sampleReceipt]
  })

  const saveReceipt = (data: typeof sampleReceipt) => {
    const updated = [...receipts, data]
    localStorage.setItem('receipts', JSON.stringify(updated))
    setReceipts(updated)
  }

  return { receipts, saveReceipt }
}
*/
