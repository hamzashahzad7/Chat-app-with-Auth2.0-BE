const prisma = require('../utils/prisma-config');

async function clearDatabase() {
  try {
    await prisma.message.deleteMany(); // Replace with other models if needed
    console.log("✅ All messages deleted");
  } catch (error) {
    console.error("❌ Error deleting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();