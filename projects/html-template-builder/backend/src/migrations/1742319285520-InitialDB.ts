import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDB1742319285520 implements MigrationInterface {
  name = 'InitialDB1742319285520';
  
  // Create table for placeholders
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "placeholders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "description" character varying NOT NULL, "category" character varying, "display_order" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_b96927f8f713c1eab04a0ad7c92" UNIQUE ("key"), CONSTRAINT "PK_aa84923cc09cf8d5f33b59ec826" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."email_template_status_enum" AS ENUM('draft', 'released', 'outdated')`,
    );
    await queryRunner.query(
      `CREATE TABLE "email_template" ("template_id" SERIAL NOT NULL, "templateTitle" character varying NOT NULL, "description" character varying NOT NULL, "emailFrom" character varying NOT NULL, "emailTo" character varying NOT NULL, "subject" character varying NOT NULL, "content" text NOT NULL, "status" "public"."email_template_status_enum" NOT NULL DEFAULT 'draft', "lastModified" date NOT NULL DEFAULT ('now'::text)::date, "deletedAt" TIMESTAMP, CONSTRAINT "PK_d3d8f90dc44c01da5b4f27b5efb" PRIMARY KEY ("template_id"))`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('b97f0b01-c3fa-45e1-ba2c-e0a560c3bda3', '{{LastName}}', 'Last name of the user', NULL, 0);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('3548a186-d0b0-4d63-9942-2ee22273c800', '{{name}}', 'Name', NULL, 0);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('f49c533f-1ef7-4932-a80c-2206ad42db91', '{{pi_firstname}}', 'Vorname des PI', 'PIs', 1);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('031a4832-19d6-4f8f-ad5d-2c3076a04830', '{{pi_lastname}}', 'Nachname des PI', 'PIs', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('171f915e-f598-44fb-bc26-a830e310b7a8', '{{pi_site}}', 'NCT-Site des PI', 'PIs', 3);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('d621ffee-c6b2-4d34-9e21-67ad3d4be256', '{{pi_main}}', 'Markierung für Main', 'PIs', 4);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('a94683cc-e5f4-4826-8434-7be245c92cbd', '{{mainPi_firstname}}', 'Vorname des Main-PI', 'Main-PIs', 1);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('91629406-5ae7-4e60-b50a-db545806e64a', '{{mainPi_lastname}}', 'Nachname des Main-PI', 'Main-PIs', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('15de66f4-0ec6-470e-b060-691871e10b0b', '{{mainPi_email}}', 'Email des Main-PI', 'Main-PIs', 3);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('d11a7947-05d5-4ee0-8168-583669821871', '{{patientRep_firstname}}', 'Vorname des Patientenvertreters', 'Patientenvertreter', 1);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('57122920-6d1c-48a8-88c5-9b6fa5fccfce', '{{patientRep_lastname}}', 'Nachname des Patientenvertreters', 'Patientenvertreter', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('fd2bc239-fa00-4663-bb3b-6146dc97d479', '{{externalPartner_firstname}}', 'Vorname des externen Partners', 'Externe Partner', 1);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('c8bded99-8ec9-4059-89b4-77b7c5eaa70c', '{{externalPartner_lastname}}', 'Nachname des externen Partners', 'Externe Partner', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('52a6ee64-a517-4bcd-9d4c-b23abe828a45', '{{externalPartner_institute}}', 'Institute des externen Partners', 'Externe Partner', 3);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('21258b41-a2b0-4e03-b368-bdb519cfbdad', '{{link_sign}}', 'Link zum Signieren', 'Links', 1);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('5c5691c5-beeb-4f2a-b650-39f3f57b9e4d', '{{link_edit}}', 'Link zum Editieren', 'Links', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('0a235f86-2aa6-4acc-80a6-7c0574194d64', '{{link_synopsis}}', 'Link zum Anschauen der Synopse', 'Links', 3);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('8dbd17d7-204b-4be1-b58e-ac9b49dbddac', '{{link_chat}}', 'Link zum Chat (Pre-Check, First Check, Regulatory Check, TMB Check)', 'Links', 4);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('923b93eb-2ea5-48f8-b4c5-4f400aede8ec', '{{link_tsb_review}}', 'Link zum TSB Review (1., 2. oder 3. Runde)', 'Links', 5);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('c2b78f37-85b2-4319-b572-ba631827b8ee', '{{signer_rejected}}', 'Name des Signers, der abgelehnt hat', 'Ablehnung', 1);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('2e120f7f-0d7d-4daf-bfde-213676d8cb6b', '{{rejection_comment}}', 'Kommentar der Ablehnung', 'Ablehnung', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('9eccce89-ee61-4c1d-ba24-7b5db653790d', '{{reviewer_role}}', 'Reviewer Rolle', 'Reviewer', 1);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('c8602fad-0875-4866-b8f4-acd91e8f4c4b', '{{nct_sites}}', 'NCT Sites', 'Allgemein', 1);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('19456772-bb96-490f-b5b1-72b72ec23603', '{{acronym}}', 'Acronym', 'Allgemein', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('f116ac49-f4f5-4be1-9382-1cce54910cbe', '{{synopsis_title}}', 'Synopsen Titel', 'Allgemein', 3);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('c98b05d5-391b-4702-8650-b04a6891ca63', '{{synopsis_title_de}}', 'Synopsen Titel Deutsch', 'Allgemein', 4);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('6e408d96-1550-44d0-8d52-3629023a59c5', '{{comments_office}}', 'Kommentar der Geschäftstelle', 'Allgemein', 5);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('db0bb639-9747-4a25-9f5d-0c0f7d526df7', '{{comments_tsb}}', 'Kommentare des TSB (1. oder 2. Runde)', 'Allgemein', 6);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('6c236d0e-894e-484b-9f2e-317f9b60c5b1', '{{date_tsb_meeting}}', 'Datum TSB Meeting (1., 2. oder 3. Runde)', 'Allgemein', 7);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('0b6f8b1b-5a58-4b57-85e2-014cb33c8638', '{{list_without_feasibility}}', 'Liste der Studienzentren ohne Feasibility Questionaires', 'Allgemein', 8);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('e609f1a4-7f8e-406e-9f15-8a0cf0223c10', '{{option_all_investigators}}', 'Alle Investigatoren', 'Empfängerliste', 1);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('d34fafc8-927f-4913-ad9e-30555cd4b127', '{{option_all_mains}}', 'Alle Mains', 'Empfängerliste', 2);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('bbbb0f31-5fd6-4398-b30f-56cf33bb51a2', '{{option_all_external_partners}}', 'Alle Externe Partner', 'Empfängerliste', 3);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('d53f019d-3bff-4e5e-8176-e556db2bfe96', '{{option_all_patient_representatives}}', 'Alle Patient Representatives', 'Empfängerliste', 4);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('5f2718dd-615d-4e79-aa6f-b2cd041c4ba3', '{{option_not_signed}}', 'Alle Investigators und Patient Representatives, die noch nicht unterschrieben haben', 'Empfängerliste', 5);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('53f439de-dafc-4a9d-a2d7-81eaf2cddbb4', '{{option_nct_committees}}', 'NCT-Gremien und Postfächer', 'Empfängerliste', 6);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('e39ef4c7-8af8-4f78-a855-f706a467b7e6', '{{option_all_nct_sites}}', 'Alle beteiligten NCT-Sites', 'Empfängerliste', 7);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('acad2813-4fde-4d09-a64a-9566fd309f84', '{{option_nct_iit}}', 'nct-iit', 'Empfängerliste', 8);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('6a8e85eb-d4d7-4404-8766-ec1a39028693', '{{option_all_documents}}', 'Alle Dokumentare', 'Empfängerliste', 9);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('b1ee0497-a54d-4df4-abf4-b3efb462155c', '{{option_named_tsb_reviewer}}', 'Named TSB Reviewer mit Rolle (z.B. Lead Primary, Secondary, Specialized)', 'Empfängerliste', 10);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('90a5cfbb-7bab-4292-b453-6974ac8a1ef3', '{{option_all_tsb_members}}', 'Alle TSB Mitglieder außer die Reviewer', 'Empfängerliste', 11);`,
    );
    await queryRunner.query(
      `INSERT INTO public.placeholders VALUES ('ad29fc5b-3304-400c-92f4-dbcac1959f44', '{{option_all_tsb_mailboxes}}', 'Alle TSB Mitglieder', 'Empfängerliste', 12);`,
    );
  }

  // Create ENUM type for email template status
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "email_template"`);
    await queryRunner.query(`DROP TYPE "public"."email_template_status_enum"`);
    await queryRunner.query(`DROP TABLE "placeholders"`);
  }
}
