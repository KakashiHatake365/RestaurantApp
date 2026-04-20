import { PropsWithChildren } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../lib/theme";

export function Screen({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.page }}
      contentContainerStyle={{
        paddingTop: insets.top + 18,
        paddingBottom: insets.bottom + 28,
        paddingHorizontal: 20,
        gap: 18,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ gap: 18 }}>{children}</View>
    </ScrollView>
  );
}


