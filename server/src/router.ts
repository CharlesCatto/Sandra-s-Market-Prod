import { Router } from "express";
import { christmasMarketActions } from "./modules/christmasMarket/christmasMarketActions";

const router = Router();

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Christmas Markets API is running!" });
});

// Christmas markets routes
router.get("/markets", christmasMarketActions.getAllMarkets);
router.get("/markets/search", christmasMarketActions.searchMarkets);
router.get("/markets/:id", christmasMarketActions.getMarketById);
router.post("/markets", christmasMarketActions.createMarket);
router.put("/markets/:id", christmasMarketActions.updateMarket);
router.delete("/markets/:id", christmasMarketActions.deleteMarket);

export default router;
