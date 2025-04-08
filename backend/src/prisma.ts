import { PrismaClient } from '@prisma/client'

// Extensão da tipagem para o objeto global do Node/TypeScript
// necessário para armazenar a instância do Prisma de forma global
declare global {
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient
    }
  }
  // Para ambientes onde globalThis é diferente (TypeScript 4.4+)
  var prisma: PrismaClient | undefined
}

// Criação ou reutilização da instância do Prisma
//  Se já existir uma instância no globalThis, reutiliza
//  Caso contrário, cria uma nova instância
const prisma: PrismaClient = globalThis.prisma || new PrismaClient()

//Armazenamento da instância no globalThis (apenas em desenvolvimento)
//Isso evita a criação de múltiplas instâncias durante o hot-reload (recarregar varias vezes durante a ediçao)
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Exporta a instância do Prisma para ser usada em toda a aplicação de forma centralizada 
export default prisma