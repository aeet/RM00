import { PrismaClient } from '@prisma/client'

const createPrisma = (): () => PrismaClient => {
  let prisma = null
  return (): PrismaClient => {
    if (prisma) return prisma
    prisma = new PrismaClient()
    return prisma
  }
}

export const usePrisma = createPrisma()
