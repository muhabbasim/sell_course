const { PrismaClient } = require ("@prisma/client")

const database = new PrismaClient();

async function main() {
  try {
    await database.category.createMany({
      data: [
        { name: "Computer Science" },
        { name: "Music" },
        { name: "Fitness" },
        { name: "Photography" },
        { name: "Engineering" },
        { name: "Filming" },
      ]
    })

    console.log("database categories seeded successfully")
  } catch (error) {
    console.log("Error seeding the database categories", error)
  } finally {
    await database.$disconnect();
  }
}

main()