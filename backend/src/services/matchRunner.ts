import { Server as SocketServer } from 'socket.io';
import pool from '../config/database';
import { simulateMatch } from './matchEngine';
import { TeamWithPlayers } from '../types';

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function runMatch(
  io: SocketServer,
  matchId: string,
  roomId: string,
  homeTeam: TeamWithPlayers,
  awayTeam: TeamWithPlayers
): Promise<void> {
  // Run match simulation
  const result = simulateMatch(homeTeam, awayTeam);

  let currentHomeScore = 0;
  let currentAwayScore = 0;

  // Emit events with delays
  for (const event of result.events) {
    // Emit event to room
    io.to(roomId).emit('match_event', event);

    // If GOAL, update score and emit score_update
    if (event.type === 'GOAL') {
      if (event.team === 'home') currentHomeScore++;
      else currentAwayScore++;

      io.to(roomId).emit('score_update', {
        home_score: currentHomeScore,
        away_score: currentAwayScore,
      });
    }

    // Wait 2-3 seconds before next event (random for drama)
    await delay(2000 + Math.random() * 1000);
  }

  // Emit match_end
  const winnerUserId =
    result.winner === 'home'
      ? homeTeam.user_id || null
      : result.winner === 'away'
      ? awayTeam.user_id || null
      : null;

  io.to(roomId).emit('match_end', {
    final_score: {
      home: result.homeScore,
      away: result.awayScore,
    },
    winner: result.winner,
    winner_user_id: winnerUserId,
  });

  // Update database with final score
  await pool.query(
    `UPDATE matches
     SET home_score = $1, away_score = $2, winner_user_id = $3, completed_at = NOW()
     WHERE id = $4`,
    [result.homeScore, result.awayScore, winnerUserId, matchId]
  );

  // Cleanup drafts if this was a Draft Battle
  // Check if home_team_id or away_team_id are in drafts table
  const draftCheck = await pool.query(
    'SELECT id FROM drafts WHERE id = $1 OR id = $2',
    [homeTeam.id, awayTeam.id]
  );

  for (const draft of draftCheck.rows) {
    await pool.query('DELETE FROM drafts WHERE id = $1', [draft.id]);
  }
}
