import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Dados de produtos por categoria
const makeupProducts = [
  {
    name: 'Base Líquida HD',
    description: 'Base líquida de alta cobertura com acabamento natural e duração prolongada. Ideal para todos os tipos de pele.',
    basePrice: 89.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { color: 'Bege Claro', undertone: 'Neutro' }, price: 89.90, stock: 50 },
      { attributes: { color: 'Bege Médio', undertone: 'Quente' }, price: 89.90, stock: 45 },
      { attributes: { color: 'Bege Escuro', undertone: 'Frio' }, price: 89.90, stock: 40 },
    ],
    images: [
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
    ],
  },
  {
    name: 'Batom Matte Longa Duração',
    description: 'Batom matte com fórmula cremosa e duração de até 12 horas. Não resseca os lábios.',
    basePrice: 45.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { color: 'Vermelho Clássico', finish: 'Matte' }, price: 45.90, stock: 60 },
      { attributes: { color: 'Rosa Nude', finish: 'Matte' }, price: 45.90, stock: 55 },
      { attributes: { color: 'Vinho', finish: 'Matte' }, price: 45.90, stock: 50 },
      { attributes: { color: 'Coral', finish: 'Matte' }, price: 45.90, stock: 48 },
    ],
    images: [
      'https://images.unsplash.com/photo-1583241805009-4b5c0c0c0c0c?w=500',
      'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=500',
    ],
  },
  {
    name: 'Paleta de Sombras 12 Cores',
    description: 'Paleta completa com 12 tons versáteis para criar looks do dia a noite. Alta pigmentação e fácil de esfumar.',
    basePrice: 129.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { palette: 'Nude', colors: 12 }, price: 129.90, stock: 35 },
      { attributes: { palette: 'Smoky', colors: 12 }, price: 129.90, stock: 30 },
      { attributes: { palette: 'Colorida', colors: 12 }, price: 129.90, stock: 25 },
    ],
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
    ],
  },
  {
    name: 'Máscara para Cílios Volume Extreme',
    description: 'Máscara que proporciona volume e alongamento extremo aos cílios. À prova d\'água.',
    basePrice: 39.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { type: 'Volume', waterproof: true }, price: 39.90, stock: 70 },
      { attributes: { type: 'Alongamento', waterproof: false }, price: 39.90, stock: 65 },
    ],
    images: [
      'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=500',
    ],
  },
  {
    name: 'Blush em Pó',
    description: 'Blush em pó com acabamento natural e duração prolongada. Disponível em vários tons.',
    basePrice: 55.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { color: 'Rosa Pêssego', finish: 'Matte' }, price: 55.90, stock: 40 },
      { attributes: { color: 'Rosa Pálido', finish: 'Satinado' }, price: 55.90, stock: 45 },
      { attributes: { color: 'Coral', finish: 'Matte' }, price: 55.90, stock: 38 },
    ],
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500',
    ],
  },
];

const skincareProducts = [
  {
    name: 'Sérum Vitamina C',
    description: 'Sérum antioxidante com vitamina C pura que ilumina e uniformiza o tom da pele. Reduz manchas e sinais de envelhecimento.',
    basePrice: 149.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { size: '30ml', concentration: '20%' }, price: 149.90, stock: 30 },
      { attributes: { size: '50ml', concentration: '20%' }, price: 229.90, stock: 25 },
    ],
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500',
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500',
    ],
  },
  {
    name: 'Hidratante Facial Ácido Hialurônico',
    description: 'Creme hidratante com ácido hialurônico que proporciona hidratação intensa por até 24 horas. Ideal para peles secas e normais.',
    basePrice: 99.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { size: '50ml', type: 'Pele Seca' }, price: 99.90, stock: 40 },
      { attributes: { size: '50ml', type: 'Pele Normal' }, price: 99.90, stock: 45 },
      { attributes: { size: '100ml', type: 'Pele Seca' }, price: 159.90, stock: 35 },
    ],
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500',
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500',
    ],
  },
  {
    name: 'Protetor Solar FPS 50',
    description: 'Protetor solar de alta proteção com textura leve e toque seco. Não deixa a pele oleosa.',
    basePrice: 79.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { spf: 50, type: 'Toque Seco' }, price: 79.90, stock: 60 },
      { attributes: { spf: 50, type: 'Hidratante' }, price: 79.90, stock: 55 },
    ],
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500',
    ],
  },
  {
    name: 'Esfoliante Facial AHA/BHA',
    description: 'Esfoliante químico com ácidos AHA e BHA que remove células mortas e desobstrui os poros. Para uso semanal.',
    basePrice: 119.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { size: '100ml', type: 'Sensível' }, price: 119.90, stock: 35 },
      { attributes: { size: '100ml', type: 'Normal' }, price: 119.90, stock: 40 },
    ],
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500',
    ],
  },
  {
    name: 'Água Micelar',
    description: 'Água micelar que remove maquiagem e impurezas sem necessidade de enxágue. Suave para a pele.',
    basePrice: 49.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { size: '200ml', type: 'Sensível' }, price: 49.90, stock: 50 },
      { attributes: { size: '400ml', type: 'Sensível' }, price: 79.90, stock: 45 },
    ],
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500',
    ],
  },
];

const hairProducts = [
  {
    name: 'Shampoo Reparador',
    description: 'Shampoo reparador para cabelos danificados. Restaura a fibra capilar e proporciona brilho intenso.',
    basePrice: 39.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { size: '300ml', type: 'Cabelos Danificados' }, price: 39.90, stock: 50 },
      { attributes: { size: '500ml', type: 'Cabelos Danificados' }, price: 59.90, stock: 45 },
    ],
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500',
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500',
    ],
  },
  {
    name: 'Condicionador Hidratante',
    description: 'Condicionador com óleo de argan que hidrata profundamente e desembaraça os fios.',
    basePrice: 44.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { size: '300ml', type: 'Hidratação Intensa' }, price: 44.90, stock: 48 },
      { attributes: { size: '500ml', type: 'Hidratação Intensa' }, price: 64.90, stock: 42 },
    ],
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500',
    ],
  },
  {
    name: 'Máscara de Tratamento',
    description: 'Máscara de tratamento profundo com queratina e proteínas. Restaura cabelos extremamente danificados.',
    basePrice: 89.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { size: '200ml', type: 'Reparação Profunda' }, price: 89.90, stock: 35 },
      { attributes: { size: '400ml', type: 'Reparação Profunda' }, price: 149.90, stock: 30 },
    ],
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500',
    ],
  },
  {
    name: 'Óleo Capilar',
    description: 'Óleo capilar multifuncional que hidrata, protege do calor e proporciona brilho. Pode ser usado em cabelos secos ou úmidos.',
    basePrice: 69.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { size: '100ml', type: 'Multifuncional' }, price: 69.90, stock: 40 },
      { attributes: { size: '200ml', type: 'Multifuncional' }, price: 119.90, stock: 35 },
    ],
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500',
    ],
  },
  {
    name: 'Spray Termoprotetor',
    description: 'Spray que protege os cabelos do calor de secadores e chapinhas. Previne danos e mantém os fios saudáveis.',
    basePrice: 54.90,
    brand: 'Olive Beauty',
    variants: [
      { attributes: { size: '200ml', spf: 'Proteção UV' }, price: 54.90, stock: 45 },
      { attributes: { size: '300ml', spf: 'Proteção UV' }, price: 74.90, stock: 40 },
    ],
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=500',
    ],
  },
];

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@olivebeauty.com' },
    update: {},
    create: {
      email: 'admin@olivebeauty.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);

  // Create sample categories
  const category1 = await prisma.category.upsert({
    where: { name: 'Maquiagem' },
    update: {},
    create: {
      name: 'Maquiagem',
      description: 'Produtos de maquiagem',
    },
  });

  const category2 = await prisma.category.upsert({
    where: { name: 'Skincare' },
    update: {},
    create: {
      name: 'Skincare',
      description: 'Produtos de cuidados com a pele',
    },
  });

  const category3 = await prisma.category.upsert({
    where: { name: 'Cabelos' },
    update: {},
    create: {
      name: 'Cabelos',
      description: 'Produtos para cabelos',
    },
  });

  console.log('Categories created');

  // Create products for Maquiagem category
  console.log('Creating makeup products...');
  for (const productData of makeupProducts) {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        basePrice: productData.basePrice,
        brand: productData.brand,
        categoryId: category1.id,
        variants: {
          create: productData.variants.map((variant) => ({
            attributes: JSON.stringify(variant.attributes),
            price: variant.price,
            stock: variant.stock,
          })),
        },
        images: {
          create: productData.images.map((url, index) => ({
            url,
            isCover: index === 0,
          })),
        },
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  // Create products for Skincare category
  console.log('Creating skincare products...');
  for (const productData of skincareProducts) {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        basePrice: productData.basePrice,
        brand: productData.brand,
        categoryId: category2.id,
        variants: {
          create: productData.variants.map((variant) => ({
            attributes: JSON.stringify(variant.attributes),
            price: variant.price,
            stock: variant.stock,
          })),
        },
        images: {
          create: productData.images.map((url, index) => ({
            url,
            isCover: index === 0,
          })),
        },
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  // Create products for Cabelos category
  console.log('Creating hair products...');
  for (const productData of hairProducts) {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        basePrice: productData.basePrice,
        brand: productData.brand,
        categoryId: category3.id,
        variants: {
          create: productData.variants.map((variant) => ({
            attributes: JSON.stringify(variant.attributes),
            price: variant.price,
            stock: variant.stock,
          })),
        },
        images: {
          create: productData.images.map((url, index) => ({
            url,
            isCover: index === 0,
          })),
        },
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

