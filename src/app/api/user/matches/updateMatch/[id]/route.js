import { handleError } from "@/helpers/errorHelper";
import { connect } from "@/lib/db";
import { NextResponse } from "next/server";

connect();

export async function PUT(request, { params }) {
  try {
    const { id } = params; // match ID
    const reqBody = await request.json();

    const {
      matchName,
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

    // Build update payload
    const updatePayload = {};

    if (matchName) updatePayload.matchName = matchName;
    if (turfId) updatePayload.turfId = turfId;

    // Update location if localMatch or turfData exists
    if (localMatch || turfData) {
      updatePayload.location = {
        type: "Point",
        coordinates: [
          localMatch?.location?.coordinates?.[0] ||
            turfData?.location?.coordinates[0],
          localMatch?.location?.coordinates?.[1] ||
            turfData?.location?.coordinates[1],
        ],
      };
    }

    // Optional localMatch update
    if (localMatch) {
      updatePayload.localMatch = {
        groundImages: localMatch.groundImages || [],
        active: localMatch.active !== undefined ? localMatch.active : true,
      };
    }

    // Booking time update
    if (slotTime) {
      updatePayload.bookingTime = {
        bookingFrom: {
          hour: slotTime.bookingFrom?.hour,
          period: slotTime.bookingFrom?.period,
        },
        bookingTo: {
          hour: slotTime.bookingTo?.hour,
          period: slotTime.bookingTo?.period,
        },
      };
    }

    // Sports update
    if (sport) {
      updatePayload.sports = {
        sport: sport.sport,
        sportFormation: sport.sportFormation,
      };
    }

    if (payAndJoin !== undefined) updatePayload.payAndJoin = payAndJoin;
    if (splitAmount !== undefined) updatePayload.splitAmount = splitAmount;
    if (gameType) updatePayload.gameType = gameType;

    // Update game type specific fields
    if (gameType === "regular" && regular) {
      updatePayload.regular = {
        members: regular.members || [],
        totalPlayers: regular.totalPlayers || 0,
      };
    }

    if (gameType === "team" && team) {
      updatePayload.team = {
        team: team.team || [],
        totalTeams: team.totalTeams || 0,
      };
    }

    if (gameType === "tournament" && tournament) {
      updatePayload.tournament = {
        entryFee: tournament.entryFee || 0,
        totalTeams: tournament.totalTeams || 0,
        prize: tournament.prize || 0,
        teams: tournament.teams || [],
      };
    }

    // Update the match
    const updatedMatch = await Match.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });

    if (!updatedMatch) {
      return NextResponse.json({ message: "Match not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Match updated successfully", match: updatedMatch },
      { status: 200 }
    );
  } catch (error) {
    handleError(error);
  }
}
