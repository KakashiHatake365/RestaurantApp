import { PropsWithChildren } from "react";
import { Text, View } from "react-native";
import { theme } from "../lib/theme";

interface SectionCardProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
}

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <View style={theme.sectionCard}>
      <View style={{ gap: 4, marginBottom: 16 }}>
        <Text style={theme.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={theme.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}


