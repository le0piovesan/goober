import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const onboardingRouter = createTRPCRouter({
  getDriverOnboardingData: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const driver = await ctx.db.driver.findUnique({
        where: { id: input.id },
        include: {
          vehicle: true,
          documents: true,
          drivingHistory: true,
          bank: true,
        },
      });

      if (!driver) {
        throw new Error("Driver not found");
      }

      return {
        currentOnboardingStep: driver.currentOnboardingStep,
        fullName: driver.fullName,
        SSN: driver.SSN,
        dateOfBirth: driver.dateOfBirth,
        gender: driver.gender,
        type: driver.vehicle?.type,
        licensePlate: driver.vehicle?.licensePlate,
        photos: driver.vehicle?.photos,
        features: driver.vehicle?.features,
        backgroundCheckDocuments: driver.documents?.backgroundCheckDocuments,
        experience: driver.drivingHistory?.experience,
        referenceLetters: driver.drivingHistory?.referenceLetters,
        accountNumber: driver.bank?.accountNumber,
        routingNumber: driver.bank?.routingNumber,
        checkNumber: driver.bank?.checkNumber,
      };
    }),

  updatePersonalInfo: publicProcedure
    .input(
      z.object({
        id: z.number(),
        fullName: z.string(),
        SSN: z.string(),
        dateOfBirth: z.date(),
        gender: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const driver = await ctx.db.driver.update({
        where: { id: input.id },
        data: {
          currentOnboardingStep: 2,
          fullName: input.fullName,
          SSN: input.SSN,
          dateOfBirth: input.dateOfBirth,
          gender: input.gender,
        },
      });
      return driver;
    }),

  updateVehicleInfo: publicProcedure
    .input(
      z.object({
        id: z.number(),
        type: z.string(),
        licensePlate: z.string(),
        photosPaths: z.array(z.string()),
        features: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const driver = await ctx.db.driver.update({
        where: { id: input.id },
        data: {
          currentOnboardingStep: 3,
          vehicle: {
            upsert: {
              create: {
                type: input.type,
                licensePlate: input.licensePlate,
                photos: input.photosPaths,
                features: input.features,
              },
              update: {
                type: input.type,
                licensePlate: input.licensePlate,
                photos: input.photosPaths,
                features: input.features,
              },
            },
          },
        },
      });

      return driver;
    }),

  updateDocuments: publicProcedure
    .input(
      z.object({
        id: z.number(),
        licensePath: z.string(),
        insurancePath: z.string(),
        backgroundCheckDocumentsPaths: z.array(z.string()),
        professionalCertificatePath: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const driver = await ctx.db.driver.update({
        where: { id: input.id },
        data: {
          currentOnboardingStep: 4,
          documents: {
            upsert: {
              create: {
                license: input.licensePath,
                insurance: input.insurancePath,
                backgroundCheckDocuments: input.backgroundCheckDocumentsPaths,
                professionalCertificate: input.professionalCertificatePath,
              },
              update: {
                license: input.licensePath,
                insurance: input.insurancePath,
                backgroundCheckDocuments: input.backgroundCheckDocumentsPaths,
                professionalCertificate: input.professionalCertificatePath,
              },
            },
          },
        },
      });

      return driver;
    }),

  updateExperience: publicProcedure
    .input(
      z.object({
        id: z.number(),
        experience: z.string(),
        referenceLettersPaths: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const driver = await ctx.db.driver.update({
        where: { id: input.id },
        data: {
          currentOnboardingStep: 5,
          drivingHistory: {
            upsert: {
              create: {
                experience: input.experience,
                referenceLetters: input.referenceLettersPaths,
              },
              update: {
                experience: input.experience,
                referenceLetters: input.referenceLettersPaths,
              },
            },
          },
        },
      });

      return driver;
    }),

  updateBankInfo: publicProcedure
    .input(
      z.object({
        id: z.number(),
        accountNumber: z.string(),
        routingNumber: z.string(),
        checkNumber: z.string(),
        bankName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const driver = await ctx.db.driver.update({
        where: { id: input.id },
        data: {
          currentOnboardingStep: 6,
          bank: {
            upsert: {
              create: {
                accountNumber: input.accountNumber,
                routingNumber: input.routingNumber,
                checkNumber: input.checkNumber,
                bankName: input.bankName,
              },
              update: {
                accountNumber: input.accountNumber,
                routingNumber: input.routingNumber,
                checkNumber: input.checkNumber,
                bankName: input.bankName,
              },
            },
          },
        },
      });

      return driver;
    }),

  completeDriverProfile: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.driver.update({
        where: { id: input.id },
        data: {
          profileCompleted: true,
          currentOnboardingStep: null,
        },
      });
    }),
});
