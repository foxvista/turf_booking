import { connect } from "@/lib/db";
import { NextResponse } from "next/server";
import { handleError } from "@/helpers/errorHelper";
import { getData } from "@/helpers/getData";
import Match from "@/model/createMatchModel";
import Turf from "@/model/turfModel";

connect();

export async function POST(request) {
  try {
    const userId = getData(request);
    const reqBody = await request.json();

    const {
      matchName,
      turfId,
      localMatch,
      slotTime,
      sport,
      payAndJoin,
      splitAmount,
      gameType,
      regular,
      team,
      tournament,
    } = reqBody;

    const turfData = await Turf.findById(turfId);

    const matchPayload = {
      userId,
      matchName,
      turfId,

      location: {
        type: "Point",
        coordinates: [
          localMatch.location.coordinates[0],
          localMatch.location.coordinates[1] || [
            turfData.location.coordinates[0],
          ],
          [turfData.location.coordinates[1]],
        ],
      },
      bookingTime: {
        bookingFrom: {
          hour: slotTime.bookingFrom.hour,
          period: slotTime.bookingFrom.period,
        },
        bookingTo: {
          hour: slotTime.bookingTo.hour,
          period: slotTime.bookingTo.period,
        },
      },
      sports: {
        sport: sport.sport,
        sportFormation: sport.sportFormation,
      },
      payAndJoin,
      splitAmount,
      gameType,
      status: "active",
    };

    if (localMatch) {
      matchPayload.localMatch = {
        groundImages: localMatch.groundImages || [],
        active: true,
      };
    }

    if (localMatch)
      if (gameType === "regular" && regular) {
        // ✅ Conditionally add based on game type
        matchPayload.regular = {
          members: regular.members || [],
          totalPlayers: regular.totalPlayers || 0,
        };
      }

    if (gameType === "team" && team) {
      matchPayload.team = {
        team: team.team || [],
        totalTeams: team.totalTeams || 0,
      };
    }

    if (gameType === "tournament" && tournament) {
      matchPayload.tournament = {
        entryFee: tournament.entryFee || 0,
        totalTeams: tournament.totalTeams || 0,
        prize: tournament.prize || 0,
        teams: tournament.teams || [],
      };
    }

    const matchData = new Match(matchPayload);
    await matchData.save();

    return NextResponse.json(
      { message: "Match created successfully", match: matchData },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}
