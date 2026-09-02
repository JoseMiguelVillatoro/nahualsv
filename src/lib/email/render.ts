import { render } from "@react-email/render";
import type { ReactElement } from "react";

export async function renderEmailTemplate(template: ReactElement): Promise<string> {
  return render(template, {
    pretty: true,
    plainText: false,
  });
}
