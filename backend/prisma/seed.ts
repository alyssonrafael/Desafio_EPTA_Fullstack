import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/authUtils';

const prisma = new PrismaClient();

// Gerador de placas aleatórias quando true o formato e mercosul
function generateLicensePlate(mercosul: boolean): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  const randomLetter = () => letters.charAt(Math.floor(Math.random() * letters.length));
  const randomNumber = () => numbers.charAt(Math.floor(Math.random() * numbers.length));

  if (mercosul) {
    // Formato Mercosul: AAA2A22
    return `${randomLetter()}${randomLetter()}${randomLetter()}${randomNumber()}${randomLetter()}${randomNumber()}${randomNumber()}`;
  } else {
    // Formato antigo: AAA2222
    return `${randomLetter()}${randomLetter()}${randomLetter()}${randomNumber()}${randomNumber()}${randomNumber()}${randomNumber()}`;
  }
}

async function main() {
  // Limpar tabelas (apenas para desenvolvimento)
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // Hash das senhas
  const password1 = await hashPassword('123456');
  const password2 = await hashPassword('654321'); 

  // Criar usuários com veículos
  const user1 = await prisma.user.create({
    data: {
      name: "João Silva",
      email: "joao.silva@example.com",
      password: password1,
      vehicles: {
        create: [
          {
            name: "Fiat Uno",
            plate: generateLicensePlate(false),
            isActive: true
          },
          {
            name: "Volkswagen Gol",
            plate: generateLicensePlate(true), 
            isActive: false
          },
          {
            name: "Hyundai HB20",
            plate: generateLicensePlate(true), 
            isActive: true
          },
          {
            name: "Chevrolet Onix",
            plate: generateLicensePlate(false),
            isActive: true
          },
          {
            name: "Renault Kwid",
            plate: generateLicensePlate(true), 
            isActive: false
          }
        ]
      }
    }
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Maria Souza",
      email: "maria.souza@example.com",
      password: password2,
      vehicles: {
        create: [
          {
            name: "Toyota Corolla",
            plate: generateLicensePlate(true), 
            isActive: true
          },
          {
            name: "Honda Civic",
            plate: generateLicensePlate(false),
            isActive: true
          },
          {
            name: "Ford Ranger",
            plate: generateLicensePlate(true), 
            isActive: false
          },
          {
            name: "Jeep Compass",
            plate: generateLicensePlate(false),
            isActive: true
          },
          {
            name: "Volkswagen Nivus",
            plate: generateLicensePlate(true), 
            isActive: true
          }
        ]
      }
    }
  });

  console.log('✅ Seed completado com sucesso!');
  console.log('\n🔑 Credenciais para teste:');
  console.log('👤 Usuário 1 - Email: joao.silva@example.com | Senha: 123456');
  console.log('👤 Usuário 2 - Email: maria.souza@example.com | Senha: 654321');
}

main()
  .catch((e) => {
    console.error('Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });