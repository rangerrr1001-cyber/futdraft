import { TeamWithPlayers, MatchEvent, MatchSimulationResult, Player } from '../types';
import { randomInt, randomElement } from '../utils/helpers';

const TOTAL_EVENTS = 50;
const HALF_TIME_EVENT = 25;

interface FormationModifiers {
  shooting: number;
  passing: number;
  defending: number;
  wide_play: number;
}

const FORMATION_MODS: Record<string, FormationModifiers> = {
  '4-3-3': { shooting: 0, passing: 0, defending: 0, wide_play: 15 },
  '4-4-2': { shooting: 0, passing: 10, defending: 0, wide_play: 0 },
  '4-2-3-1': { shooting: 10, passing: 0, defending: -10, wide_play: 0 },
  '3-5-2': { shooting: 0, passing: 15, defending: -10, wide_play: -10 },
  '4-2-2-2': { shooting: 0, passing: 0, defending: 0, wide_play: 0 },
  '3-4-3': { shooting: 20, passing: 0, defending: -10, wide_play: 0 },
};

export function simulateMatch(homeTeam: TeamWithPlayers, awayTeam: TeamWithPlayers): MatchSimulationResult {
  const events: MatchEvent[] = [];
  let homeScore = 0;
  let awayScore = 0;
  let possession: 'home' | 'away' = 'home';

  // Kickoff
  events.push({
    type: 'KICKOFF',
    minute: 0,
    team: possession,
    player: null,
    description: 'Match kicks off!',
  });

  // Generate events
  for (let i = 1; i < TOTAL_EVENTS; i++) {
    const minute = Math.floor((i / TOTAL_EVENTS) * 90);

    // Half time
    if (i === HALF_TIME_EVENT) {
      events.push({
        type: 'HALF_TIME',
        minute: 45,
        team: null,
        player: null,
        description: `Half-time whistle! Score: ${homeScore}-${awayScore}`,
      });
      continue;
    }

    const attackingTeam = possession === 'home' ? homeTeam : awayTeam;
    const defendingTeam = possession === 'home' ? awayTeam : homeTeam;

    const event = generateEvent(attackingTeam, defendingTeam, possession, minute);
    events.push(event);

    // Update score
    if (event.type === 'GOAL') {
      if (event.team === 'home') homeScore++;
      else awayScore++;
    }

    // Switch possession on certain events
    if (['INTERCEPTION', 'TACKLE', 'SAVE', 'MISS', 'GOAL'].includes(event.type)) {
      possession = possession === 'home' ? 'away' : 'home';
    }
  }

  // Full time
  events.push({
    type: 'FULL_TIME',
    minute: 90,
    team: null,
    player: null,
    description: `Full-time whistle! Final score: ${homeScore}-${awayScore}`,
  });

  const winner = homeScore > awayScore ? 'home' : awayScore > homeScore ? 'away' : 'draw';

  return {
    events,
    homeScore,
    awayScore,
    winner,
  };
}

function generateEvent(
  attackingTeam: TeamWithPlayers,
  defendingTeam: TeamWithPlayers,
  team: 'home' | 'away',
  minute: number
): MatchEvent {
  const attackFormationMods = FORMATION_MODS[attackingTeam.formation] || FORMATION_MODS['4-3-3'];
  const defendFormationMods = FORMATION_MODS[defendingTeam.formation] || FORMATION_MODS['4-3-3'];

  // Calculate team averages
  const attackAvgPassing = getTeamAverage(attackingTeam, 'passing');
  const attackAvgShooting = getTeamAverage(attackingTeam, 'shooting');
  const attackAvgDribbling = getTeamAverage(attackingTeam, 'dribbling');
  const defendAvgDefending = getTeamAverage(defendingTeam, 'defending');

  // Playstyle modifiers
  let passBonus = 0;
  let shotBonus = 0;
  let defenseBonus = 0;

  if (attackingTeam.playstyle === 'Tiki-Taka') passBonus = 10;
  if (attackingTeam.playstyle === 'Long Ball') shotBonus = 20;
  if (defendingTeam.playstyle === 'Counter') defenseBonus = 5;

  // Random event selection based on probabilities
  const tackleProb = (defendAvgDefending + defenseBonus + defendFormationMods.defending) / 400;
  const shotProb = (attackAvgShooting + shotBonus + attackFormationMods.shooting) / 350;
  const dribbleProb = attackAvgDribbling / 500;
  const passProb = 0.4; // Base pass probability

  const rand = Math.random();

  if (rand < tackleProb) {
    return createDefensiveEvent(defendingTeam, team === 'home' ? 'away' : 'home', minute);
  } else if (rand < tackleProb + shotProb) {
    return createShootingEvent(attackingTeam, defendingTeam, team, minute);
  } else if (rand < tackleProb + shotProb + dribbleProb) {
    return createDribbleEvent(attackingTeam, team, minute);
  } else {
    return createPassEvent(attackingTeam, team, minute);
  }
}

function createDefensiveEvent(
  team: TeamWithPlayers,
  teamSide: 'home' | 'away',
  minute: number
): MatchEvent {
  const defenders = team.players.filter(p =>
    ['CB', 'LB', 'RB', 'CDM'].includes(p.player.position)
  );

  const player = defenders.length > 0 ? randomElement(defenders).player : team.players[0].player;

  const eventType = Math.random() > 0.5 ? 'TACKLE' : 'INTERCEPTION';

  return {
    type: eventType,
    minute,
    team: teamSide,
    player: {
      name: player.name,
      position: player.position,
      ovr: player.ovr,
    },
    description: eventType === 'TACKLE'
      ? `${player.name} (${player.ovr} ${player.position}) wins the ball with a strong tackle!`
      : `${player.name} (${player.ovr} ${player.position}) intercepts the pass!`,
  };
}

function createShootingEvent(
  attackingTeam: TeamWithPlayers,
  defendingTeam: TeamWithPlayers,
  teamSide: 'home' | 'away',
  minute: number
): MatchEvent {
  const attackers = attackingTeam.players.filter(p =>
    ['ST', 'LW', 'RW', 'CAM'].includes(p.player.position)
  );

  const shooter = attackers.length > 0 ? randomElement(attackers).player : attackingTeam.players[attackingTeam.players.length - 1].player;

  // Goal probability based on shooting vs GK defending
  const gkPlayer = defendingTeam.players.find(p => p.player.position === 'GK');
  const gkDefending = gkPlayer ? gkPlayer.player.defending : 70;

  const goalChance = (shooter.shooting - gkDefending + randomInt(-30, 30)) / 100;

  if (goalChance > 0.5) {
    // GOAL
    return {
      type: 'GOAL',
      minute,
      team: teamSide,
      player: {
        name: shooter.name,
        position: shooter.position,
        ovr: shooter.ovr,
      },
      description: `⚽ GOAL! ${shooter.name} (${shooter.ovr} ${shooter.position}) fires it into the net!`,
    };
  } else if (goalChance > 0.2) {
    // SAVE
    const gk = gkPlayer?.player || defendingTeam.players[0].player;
    return {
      type: 'SAVE',
      minute,
      team: teamSide === 'home' ? 'away' : 'home',
      player: {
        name: gk.name,
        position: gk.position,
        ovr: gk.ovr,
      },
      description: `${gk.name} (${gk.ovr} GK) makes a brilliant save from ${shooter.name}'s shot!`,
    };
  } else {
    // MISS
    return {
      type: 'MISS',
      minute,
      team: teamSide,
      player: {
        name: shooter.name,
        position: shooter.position,
        ovr: shooter.ovr,
      },
      description: `${shooter.name}'s shot goes wide!`,
    };
  }
}

function createDribbleEvent(
  team: TeamWithPlayers,
  teamSide: 'home' | 'away',
  minute: number
): MatchEvent {
  const dribblers = team.players.filter(p =>
    ['ST', 'LW', 'RW', 'CAM', 'CM'].includes(p.player.position)
  );

  const player = dribblers.length > 0 ? randomElement(dribblers).player : team.players[Math.floor(team.players.length / 2)].player;

  return {
    type: 'DRIBBLE',
    minute,
    team: teamSide,
    player: {
      name: player.name,
      position: player.position,
      ovr: player.ovr,
    },
    description: `${player.name} (${player.ovr} ${player.position}) beats the defender with skillful dribbling!`,
  };
}

function createPassEvent(
  team: TeamWithPlayers,
  teamSide: 'home' | 'away',
  minute: number
): MatchEvent {
  const midfielders = team.players.filter(p =>
    ['CM', 'CDM', 'CAM'].includes(p.player.position)
  );

  const player = midfielders.length > 0 ? randomElement(midfielders).player : team.players[Math.floor(team.players.length / 2)].player;

  const passTypes = [
    'threads a pass to teammate',
    'plays a through ball',
    'switches play with a long pass',
    'passes to a teammate in space',
  ];

  return {
    type: 'PASS',
    minute,
    team: teamSide,
    player: {
      name: player.name,
      position: player.position,
      ovr: player.ovr,
    },
    description: `${player.name} (${player.ovr} ${player.position}) ${randomElement(passTypes)}`,
  };
}

function getTeamAverage(team: TeamWithPlayers, stat: keyof Player): number {
  const sum = team.players.reduce((acc, p) => acc + (p.player[stat] as number || 0), 0);
  return sum / team.players.length;
}
