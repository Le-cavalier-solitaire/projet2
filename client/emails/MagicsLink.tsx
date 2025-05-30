import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

interface LinearLoginCodeEmailProps {
  validationCode?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const MagicsLink = ({
  validationCode = "tt226-5398x", // Valeur par défaut
}: LinearLoginCodeEmailProps) => (
  <Tailwind>
    <Html>
      <Head />
      <Body className="bg-white font-sans">
        <Preview>Your login code for Linear</Preview>
        <Container className="mx-auto max-w-[560px] py-0 px-0 pb-12">
          <Img
            src={`${baseUrl}/static/linear-logo.png`}
            width="42"
            height="42"
            alt="Linear"
            className="rounded-full w-[42px] h-[42px]"
          />
          <Heading className="text-[24px] tracking-[-0.5px] leading-[1.3] font-normal text-[#484848] pt-[17px]">
            Your login code for Linear
          </Heading>
          <Section className="py-[27px]">
            <Button
              className="bg-[#5e6ad2] rounded-[3px] font-semibold text-white text-[15px] no-underline text-center block py-[11px] px-[23px]"
              href="https://linear.app"
            >
              Login to Linear
            </Button>
          </Section>
          <Text className="my-0 mb-[15px] text-[15px] leading-[1.4] text-[#3c4149]">
            This link and code will only be valid for the next 5 minutes. If the
            link does not work, you can use the login verification code
            directly:
          </Text>
          <code className="font-mono font-bold px-[4px] py-[1px] bg-[#dfe1e4] tracking-[-0.3px] text-[21px] rounded-[4px] text-[#3c4149]">
            {validationCode}
          </code>
          <Hr className="border-t border-[#dfe1e4] my-[42px]" />
          <Link
            href="https://linear.app"
            className="text-[14px] text-[#b4becc]"
          >
            Linear
          </Link>
        </Container>
      </Body>
    </Html>
  </Tailwind>
);

 MagicsLink.PreviewProps = {
  validationCode: "tt226-5398x",
} as LinearLoginCodeEmailProps;

export default MagicsLink;
