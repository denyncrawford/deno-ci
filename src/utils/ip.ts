import { Netmask } from "npm:netmask";
import { CONFIG } from "../config.ts";

export function inAuthorizedSubnet(ip: string): boolean {
  const authorizedSubnet = CONFIG.AUTHORIZED_SUBNETS.map(
    (subnet) => new Netmask(subnet)
  );
  return authorizedSubnet.some((subnet) => subnet.contains(ip));
}

export function isAuthorizedIP(ip?: string): boolean {
  const ipv4 = (ip || "").replace("::ffff:", "");
  return (
    inAuthorizedSubnet(ipv4) ||
    CONFIG.AUTHORIZED_IPS.includes(ipv4 as typeof CONFIG.AUTHORIZED_IPS[0]) ||
    CONFIG.GITHUB_IPS.includes(ipv4 as typeof CONFIG.GITHUB_IPS[0])
  );
}