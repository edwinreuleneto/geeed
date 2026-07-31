// Saudação conforme o horário. Recebe a hora para permanecer pura.

export function greeting(hour: number): string {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}
