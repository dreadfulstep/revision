export type DiscordUser = {
  id: string;
  username: string;
  avatar?: string | null;
  banner?: string | null;
  public_flags: number;
  flags: number;
  global_name: string | null;
  email?: string | null;
};