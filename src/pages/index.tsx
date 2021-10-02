import type { NextPage } from "next";
import Head from "next/head";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import Hero from "src/sections/hero";
import Contributors from "src/sections/contributors";
import Navbar from "src/components/Navbar";
import axios from "axios";

type Profiles = {
  profiles: Array<{
    username: string;
    descrition: string;
  }>;
};
const Home: NextPage<Profiles> = ({ profiles }) => {
  return (
    <div>
      <Head>
        <title>Hacktober Fest 2021</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <Hero />

      <Contributors profiles={profiles} />
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const files = fs.readdirSync(path.join("profiles"));
  const profiles = await Promise.all(
    files.map(async (filename) => {
      // Create slug
      const slug = filename.replace(".md", "");

      // Get frontmatter
      const markdownWithMeta = fs.readFileSync(
        path.join("profiles", filename),
        "utf-8"
      );

      const { data: frontmatter } = matter(markdownWithMeta);
      const { data } = await axios.get(
        `https://api.github.com/users/${frontmatter.username}`
      );

      const frontmatterWithGithub = {...frontmatter, ...data as any};

      return {
        slug,
        frontmatterWithGithub,
      };
    })
  );
  return {
    props: {
      profiles,
    },
  };
}
