import { useEffect, useState } from "react";
import { apiFetch, getAPIURL } from "@/components/const";

export default function WifiQr() {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [security, setSecurity] = useState("WPA");
  const [hidden, setHidden] = useState(false);

  const [src, setSrc] = useState("");

  async function generateQr() {
    const res = await apiFetch(
      getAPIURL(
        "/api/qrcode/generate?" +
          new URLSearchParams({
            ssid,
            password,
            security,
            hidden: hidden.toString(),
          })
      )
    );

    const blob = await res.blob();

    // Revoke previous object URL to avoid memory leaks
    if (src) {
      URL.revokeObjectURL(src);
    }

    setSrc(URL.createObjectURL(blob));
  }
  

  return (
    <>
      <input
        value={ssid}
        onChange={(e) => setSsid(e.target.value)}
        placeholder="SSID"
      />

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />

      <select
        value={security}
        onChange={(e) => setSecurity(e.target.value)}
      >
        <option>WPA</option>
        <option>WEP</option>
        <option>nopass</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={hidden}
          onChange={(e) => setHidden(e.target.checked)}
        />
        Hidden SSID
      </label>

      <button onClick={generateQr}>
        Generate QR
      </button>

      <img src={src} alt="WiFi QR" height={80} width={80} />
    </>
  );
}