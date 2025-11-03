import { Pool } from "pg";
import dotenv from "dotenv";
import { users, christmasMarkets } from "../src/database/seedData";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function seed() {
  console.log("🌱 Seeding database with Christmas markets data...");

  try {
    await pool.query("BEGIN");

    console.log("📥 Handling users...");
    const userIds: number[] = [];

    for (const user of users) {
      // Vérifier si l'user existe déjà
      const existingUser = await pool.query(
        'SELECT id FROM "user" WHERE username = $1 OR email = $2',
        [user.username, user.email],
      );

      if (existingUser.rows.length > 0) {
        // User existe déjà, utiliser son ID
        const userId = existingUser.rows[0].id;
        userIds.push(userId);
        console.log(
          `  ✅ User already exists: ${user.username} (ID: ${userId})`,
        );
      } else {
        // Insérer le nouvel user
        console.log(`  Inserting user: ${user.username}`);
        const result = await pool.query(
          `INSERT INTO "user" (username, email, password, profile_picture, firstname, lastname, birthdate, phone_number, sold, is_admin)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
          [
            user.username,
            user.email,
            user.password,
            user.profile_picture,
            user.firstname,
            user.lastname,
            user.birthdate,
            user.phone_number,
            user.sold,
            user.is_admin,
          ],
        );
        const userId = result.rows[0].id;
        userIds.push(userId);
        console.log(`  ✅ User inserted with ID: ${userId}`);
      }
    }

    // Vider les marchés existants avant d'insérer les nouveaux
    console.log("🗑️  Clearing existing Christmas markets...");
    await pool.query("DELETE FROM christmas_market");
    console.log("  ✅ Existing markets cleared");

    console.log("📥 Inserting Christmas markets...");
    for (const market of christmasMarkets) {
      // Utiliser le premier user_id disponible
      const userId = userIds[0] || 1;

      // Convertir explicitement en JSON
      const animationTypeJson = JSON.stringify(market.animation_type);
      const usualDaysJson = JSON.stringify(market.usual_days);

      console.log(`  Inserting market: ${market.name} with user_id: ${userId}`);

      await pool.query(
        `INSERT INTO christmas_market 
         (name, location, address, number_of_exponents, number_of_craftsmen, place_type, 
          animation_type, animals_forbidden, exposition, santa_present, restauration, usual_days, user_id)
         VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          market.name,
          market.location.y, // longitude
          market.location.x, // latitude
          market.address,
          market.number_of_exponents,
          market.number_of_craftsmen,
          market.place_type,
          animationTypeJson,
          market.animals_forbidden,
          market.exposition,
          market.santa_present,
          market.restauration,
          usualDaysJson,
          userId,
        ],
      );
      console.log(`  ✅ Market inserted: ${market.name}`);
    }

    await pool.query("COMMIT");
    console.log(
      `✅ Seed completed successfully! Processed ${users.length} users and inserted ${christmasMarkets.length} Christmas markets.`,
    );
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("❌ Seed failed:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed().catch(() => process.exit(1));
