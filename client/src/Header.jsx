import React from "react";
import { Header, Group, Title, ActionIcon, createStyles, useMantineColorScheme } from "@mantine/core";
import { IconLanguage, IconMoonStars, IconSun } from "@tabler/icons";

const HEADER_HEIGHT = 60;

const useStyles = createStyles(({ colors, colorScheme }) => ({
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 10px"
  },
  logo: {
    color: colorScheme === "light" ? colors.blue[8] : colors.yellow[6]
  },
}));

const AppHeader = () => {
  const { classes } = useStyles();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  
  return (
    <Header height={HEADER_HEIGHT} className={classes.header}>
      <Group spacing="xs" className={classes.logo}>
        <IconLanguage size={30} />
        <Title order={2}>Translator</Title>
      </Group>
      <ActionIcon variant="outline" size="lg" color={colorScheme === "light" ? "blue.8" : "yellow.6"} onClick={() => toggleColorScheme()}>
        {colorScheme === "light" ? <IconMoonStars /> : <IconSun />}
      </ActionIcon>
    </Header>
  );
};

export default AppHeader;