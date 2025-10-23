import type { Request, Response, RequestHandler } from "express";
import { christmasMarketRepository } from "./christmasMarketRepository";

// Définir explicitement chaque méthode comme RequestHandler
export const christmasMarketActions = {
  getAllMarkets: (async (req: Request, res: Response) => {
    try {
      const markets = await christmasMarketRepository.findAll();
      res.json(markets);
    } catch (error) {
      console.error("Error fetching markets:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler,

  getMarketById: (async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid market ID" });
    }

    try {
      const market = await christmasMarketRepository.findById(id);
      if (!market) {
        return res.status(404).json({ error: "Market not found" });
      }
      res.json(market);
    } catch (error) {
      console.error("Error fetching market:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler,

  createMarket: (async (req: Request, res: Response) => {
    try {
      const marketData = {
        ...req.body,
        user_id: (req as { user?: { id: number } }).user?.id || 1,
      };

      const newMarket = await christmasMarketRepository.create(marketData);
      res.status(201).json(newMarket);
    } catch (error) {
      console.error("Error creating market:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler,

  updateMarket: (async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid market ID" });
    }

    try {
      const updatedMarket = await christmasMarketRepository.update(
        id,
        req.body,
      );
      if (!updatedMarket) {
        return res.status(404).json({ error: "Market not found" });
      }
      res.json(updatedMarket);
    } catch (error) {
      console.error("Error updating market:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler,

  deleteMarket: (async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid market ID" });
    }

    try {
      const deleted = await christmasMarketRepository.delete(id);
      if (!deleted) {
        return res.status(404).json({ error: "Market not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting market:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler,

  searchMarkets: (async (req: Request, res: Response) => {
    try {
      const { lat, lng, radius = "50" } = req.query;

      if (!lat || !lng) {
        return res
          .status(400)
          .json({ error: "Latitude and longitude are required" });
      }

      const latitude = Number.parseFloat(lat as string);
      const longitude = Number.parseFloat(lng as string);
      const radiusKm = Number.parseFloat(radius as string);

      if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude) ||
        Number.isNaN(radiusKm)
      ) {
        return res.status(400).json({ error: "Invalid coordinates or radius" });
      }

      const markets = await christmasMarketRepository.findByRadius(
        latitude,
        longitude,
        radiusKm,
      );
      res.json(markets);
    } catch (error) {
      console.error("Error searching markets:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }) as RequestHandler,
};
