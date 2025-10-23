import pool from "../../database/client";
import type {
  ChristmasMarket,
  ChristmasMarketCreate,
  ChristmasMarketUpdate,
} from "./christmasMarketTypes";

// Test de connexion au démarrage
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log("✅ Database connection successful");
    client.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

testConnection();

export const christmasMarketRepository = {
  // Récupérer tous les marchés
  async findAll(): Promise<ChristmasMarket[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(`
        SELECT 
          id,
          name,
          ST_X(location::geometry) as x,
          ST_Y(location::geometry) as y,
          address,
          number_of_exponents,
          number_of_craftsmen,
          place_type,
          animation_type,
          animals_forbidden,
          exposition,
          santa_present,
          restauration,
          usual_days,
          user_id,
          created_at,
          updated_at
        FROM christmas_market
        ORDER BY created_at DESC
      `);

      return result.rows.map((row) => ({
        ...row,
        location: { x: Number.parseFloat(row.y), y: Number.parseFloat(row.x) },
      }));
    } catch (error) {
      console.error("Database error in findAll:", error);
      throw error;
    } finally {
      client.release();
    }
  },

  // Récupérer un marché par ID
  async findById(id: number): Promise<ChristmasMarket | null> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `
        SELECT 
          id,
          name,
          ST_X(location::geometry) as x,
          ST_Y(location::geometry) as y,
          address,
          number_of_exponents,
          number_of_craftsmen,
          place_type,
          animation_type,
          animals_forbidden,
          exposition,
          santa_present,
          restauration,
          usual_days,
          user_id,
          created_at,
          updated_at
        FROM christmas_market 
        WHERE id = $1
      `,
        [id],
      );

      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        ...row,
        location: { x: Number.parseFloat(row.y), y: Number.parseFloat(row.x) },
      };
    } catch (error) {
      console.error("Database error in findById:", error);
      throw error;
    } finally {
      client.release();
    }
  },

  // Créer un nouveau marché
  async create(marketData: ChristmasMarketCreate): Promise<ChristmasMarket> {
    const client = await pool.connect();
    try {
      const animationTypeJson = JSON.stringify(marketData.animation_type);
      const usualDaysJson = JSON.stringify(marketData.usual_days);

      const result = await client.query(
        `
        INSERT INTO christmas_market 
          (name, location, address, number_of_exponents, number_of_craftsmen, 
           place_type, animation_type, animals_forbidden, exposition, 
           santa_present, restauration, usual_days, user_id)
        VALUES ($1, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING 
          id,
          name,
          ST_X(location::geometry) as x,
          ST_Y(location::geometry) as y,
          address,
          number_of_exponents,
          number_of_craftsmen,
          place_type,
          animation_type,
          animals_forbidden,
          exposition,
          santa_present,
          restauration,
          usual_days,
          user_id,
          created_at,
          updated_at
      `,
        [
          marketData.name,
          marketData.location.y, // longitude
          marketData.location.x, // latitude
          marketData.address,
          marketData.number_of_exponents,
          marketData.number_of_craftsmen,
          marketData.place_type,
          animationTypeJson,
          marketData.animals_forbidden,
          marketData.exposition,
          marketData.santa_present,
          marketData.restauration,
          usualDaysJson,
          marketData.user_id,
        ],
      );

      const row = result.rows[0];
      return {
        ...row,
        location: { x: Number.parseFloat(row.y), y: Number.parseFloat(row.x) },
      };
    } catch (error) {
      console.error("Database error in create:", error);
      throw error;
    } finally {
      client.release();
    }
  },

  // Mettre à jour un marché
  async update(
    id: number,
    marketData: ChristmasMarketUpdate,
  ): Promise<ChristmasMarket | null> {
    const client = await pool.connect();
    try {
      const fields = [];
      const values = [];
      let paramCount = 1;

      // Construction dynamique de la requête
      if (marketData.name !== undefined) {
        fields.push(`name = $${paramCount}`);
        values.push(marketData.name);
        paramCount++;
      }

      if (marketData.location !== undefined) {
        fields.push(
          `location = ST_SetSRID(ST_MakePoint($${paramCount}, $${paramCount + 1}), 4326)`,
        );
        values.push(marketData.location.y, marketData.location.x);
        paramCount += 2;
      }

      if (marketData.address !== undefined) {
        fields.push(`address = $${paramCount}`);
        values.push(marketData.address);
        paramCount++;
      }

      if (marketData.number_of_exponents !== undefined) {
        fields.push(`number_of_exponents = $${paramCount}`);
        values.push(marketData.number_of_exponents);
        paramCount++;
      }

      if (marketData.number_of_craftsmen !== undefined) {
        fields.push(`number_of_craftsmen = $${paramCount}`);
        values.push(marketData.number_of_craftsmen);
        paramCount++;
      }

      if (marketData.place_type !== undefined) {
        fields.push(`place_type = $${paramCount}`);
        values.push(marketData.place_type);
        paramCount++;
      }

      if (marketData.animation_type !== undefined) {
        fields.push(`animation_type = $${paramCount}`);
        values.push(JSON.stringify(marketData.animation_type));
        paramCount++;
      }

      if (marketData.animals_forbidden !== undefined) {
        fields.push(`animals_forbidden = $${paramCount}`);
        values.push(marketData.animals_forbidden);
        paramCount++;
      }

      if (marketData.exposition !== undefined) {
        fields.push(`exposition = $${paramCount}`);
        values.push(marketData.exposition);
        paramCount++;
      }

      if (marketData.santa_present !== undefined) {
        fields.push(`santa_present = $${paramCount}`);
        values.push(marketData.santa_present);
        paramCount++;
      }

      if (marketData.restauration !== undefined) {
        fields.push(`restauration = $${paramCount}`);
        values.push(marketData.restauration);
        paramCount++;
      }

      if (marketData.usual_days !== undefined) {
        fields.push(`usual_days = $${paramCount}`);
        values.push(JSON.stringify(marketData.usual_days));
        paramCount++;
      }

      // Finaliser avec l'ID
      values.push(id);

      if (fields.length === 0) {
        return this.findById(id);
      }

      const result = await client.query(
        `
        UPDATE christmas_market 
        SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramCount}
        RETURNING 
          id,
          name,
          ST_X(location::geometry) as x,
          ST_Y(location::geometry) as y,
          address,
          number_of_exponents,
          number_of_craftsmen,
          place_type,
          animation_type,
          animals_forbidden,
          exposition,
          santa_present,
          restauration,
          usual_days,
          user_id,
          created_at,
          updated_at
      `,
        values,
      );

      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        ...row,
        location: { x: Number.parseFloat(row.y), y: Number.parseFloat(row.x) },
      };
    } catch (error) {
      console.error("Database error in update:", error);
      throw error;
    } finally {
      client.release();
    }
  },

  // Supprimer un marché
  async delete(id: number): Promise<boolean> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "DELETE FROM christmas_market WHERE id = $1",
        [id],
      );
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Database error in delete:", error);
      throw error;
    } finally {
      client.release();
    }
  },

  // Rechercher par rayon (en km)
  async findByRadius(
    lat: number,
    lng: number,
    radiusKm: number,
  ): Promise<ChristmasMarket[]> {
    const client = await pool.connect();
    try {
      const result = await client.query(
        `
        SELECT 
          id,
          name,
          ST_X(location::geometry) as x,
          ST_Y(location::geometry) as y,
          address,
          number_of_exponents,
          number_of_craftsmen,
          place_type,
          animation_type,
          animals_forbidden,
          exposition,
          santa_present,
          restauration,
          usual_days,
          user_id,
          created_at,
          updated_at,
          ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) as distance
        FROM christmas_market
        WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)
        ORDER BY distance
      `,
        [lng, lat, radiusKm * 1000],
      ); // Conversion km en mètres

      return result.rows.map((row) => ({
        ...row,
        location: { x: Number.parseFloat(row.y), y: Number.parseFloat(row.x) },
        distance: row.distance,
      }));
    } catch (error) {
      console.error("Database error in findByRadius:", error);
      throw error;
    } finally {
      client.release();
    }
  },
};
