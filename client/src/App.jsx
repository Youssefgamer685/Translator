import React, { useContext } from "react";
import { AppShell, Textarea, Flex, Group, Text, CopyButton, ActionIcon, Tooltip, NativeSelect, Loader, Alert, Title, Button, useMantineTheme } from "@mantine/core";
import { IconCopy, IconVolume, IconClipboard, IconCircleX, IconArrowsExchange, IconNetworkOff, IconAlertCircle } from "@tabler/icons";
import { TranslateContext, TranslateProvider } from "./TranslateContext";
import Header from "./Header";

const App = () => {
  const { colors } = useMantineTheme();
  const { currentColorScheme, value, setValue, translatedValue, textFromClipboard, pasted, setPasted, langs, langpair, setLangpair, loading, exchangeLang, speechText, langsError } = useContext(TranslateContext);
  
  return (
    <AppShell header={<Header />} styles={{
      body: {
        backgroundColor: (currentColorScheme === "light" ? "white" : colors.dark[9]),
      },
    }}>
    <Textarea size="xl" placeholder="Enter Some Text..." styles={{ input: { height: 180 } }} value={value} onInput={setValue} disabled={langs === null} />
      <Flex style={{ margin: "15px 0" }} justify="space-between" align="canter">
        <Group spacing={7}>
          <Text weight={600} color={currentColorScheme === "light" ? "black" : "lightgray"}>{langpair.from.label}</Text>
          {loading && (
            <Loader size={22} />
          )}
        </Group>
        <Group>
          {(textFromClipboard && !pasted) && (
            <Tooltip label="Paste" withArrow events={{ touch: true }}>
              <ActionIcon onClick={() => {setValue(textFromClipboard); setPasted(true)}} variant="filled" color={currentColorScheme === "light" ? "blue.8" : "yellow.6"}>
                <IconClipboard size={20} />
              </ActionIcon>
            </Tooltip>
          )}
          {value && (
            <Tooltip label="Clear" withArrow events={{ touch: true }}>
              <ActionIcon onClick={() => setValue("")} variant="outline" color="red.8">
                <IconCircleX size={20} />
              </ActionIcon>
            </Tooltip>
          )}
          <CopyButton value={value}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied" : "Copy"} withArrow events={{ touch: true }}>
                <ActionIcon onClick={copy} variant="outline" color={currentColorScheme === "light" ? "blue.8" : "yellow.6"} disabled={value === ""}>
                  <IconCopy size={20} />
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <Tooltip label="Speech" withArrow events={{ touch: true }}>
            <ActionIcon onClick={() => speechText(value, "from")} variant="outline" color={currentColorScheme === "light" ? "blue.8" : "yellow.6"} disabled={value === ""}>
              <IconVolume size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Flex>
      <Textarea disabled size="xl" placeholder="Translated Text Here..." styles={{ input: { height: 180 } }} value={translatedValue} />
      <Flex style={{ margin: "15px 0" }} justify="space-between" align="canter">
        <Text weight={600} color={currentColorScheme === "light" ? "black" : "lightgray"}>{langpair.to.label}</Text>
        <Group>
          <CopyButton value={translatedValue}>
            {({ copied, copy }) => (
              <Tooltip label={copied ? "Copied" : "Copy"} withArrow events={{ touch: true }}>
                <ActionIcon onClick={copy} variant="outline" color={currentColorScheme === "light" ? "blue.8" : "yellow.6"} disabled={translatedValue === ""}>
                  <IconCopy size={20} />
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
          <Tooltip label="Speech" withArrow events={{ touch: true }}>
            <ActionIcon onClick={() => speechText(translatedValue, "to")} variant="outline" color={currentColorScheme === "light" ? "blue.8" : "yellow.6"} disabled={translatedValue === ""}>
              <IconVolume size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Flex>
      <Flex style={{ height: 100 }} align="center" justify={langs ? "space-between" : "center"}>
        {langs === null ? (
          <>
            {langsError ? (
              <Alert icon={<IconAlertCircle />} title="Something Went Wrong!" color="red.8" variant="outline">
                {langsError}
              </Alert>
            ) : (
              <Group>
                <Loader />
                <Text weight={600} color={currentColorScheme === "dark" ? "lightgray" : "black"}>Getting Languages...</Text>
              </Group>
            )}
          </>
        ) : (
          <>
            <NativeSelect label="Translate From..." styles={{ wrapper: { marginBottom: 20 }, input: { width: 130, height: 70 } }} value={langpair.from.value} onChange={({ currentTarget }) => setLangpair(({ to }) => ({ to, from: { value: currentTarget.value, label: Array.from(currentTarget.children).filter((option) => option.value === currentTarget.value)[0].innerHTML } }))} data={langs} />
            <ActionIcon variant="outline" size={35} color={currentColorScheme === "dark" ? "yellow.6" : "blue.8"} disabled={langpair.from.value === "auto"} onClick={() => exchangeLang(langpair.from, langpair.to)}>
              <IconArrowsExchange size={30} />
            </ActionIcon>
            <NativeSelect label="Translate To..." styles={{ wrapper: { marginBottom: 20 }, input: { width: 130, height: 70 } }} value={langpair.to.value} onChange={({ currentTarget }) => setLangpair(({ from }) => ({ from, to: { value: currentTarget.value, label: Array.from(currentTarget.children).filter((option) => option.value === currentTarget.value)[0].innerHTML } }))} data={langs.filter((lang) => lang.value !== "auto")} />
          </>
        )}
      </Flex>
    </AppShell>
  );
};

export default App;