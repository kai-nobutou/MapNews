import axios from 'axios';
import dotenv from "dotenv";

dotenv.config();

export interface Coordinates {
  latitude: number;
  longitude: number;
  formattedAddress?: string; 
}

/**
 * Google Geocoding APIを使って住所を緯度経度に変換
 */
export async function geocodeAddressWithGoogle(address: string): Promise<Coordinates | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error("❌ APIキーが設定されていません。");
    return null;
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json`;

  try {
    const response = await axios.get(url, {
      params: {
        address,
        key: apiKey
      }
    });

    console.log('🔍Google APIの生レスポンス:', response.data);

    if (response.data.status === "OK" && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      const formattedAddress = response.data.results[0].formatted_address; // 正式な住所

      return {
        latitude: location.lat,
        longitude: location.lng,
        formattedAddress,
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Googleジオコーディングエラー:', error);
    return null;
  }
}

