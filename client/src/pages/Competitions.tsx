import React from "react";
import { SEO } from "@/components/SEO";
import { Trophy, Users, Target, Calendar, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Competitions() {
  return (
    <div>
      <SEO
        title="Competitions & Y-Court"
        description="Explore NRSA competitions including Y-Court, the National Alpha League, and school championships. Find out how to enter and what to expect at each level."
        path="/competitions"
        breadcrumbs={[{ name: "Competitions", url: "/competitions" }]}
      />
      {/* Page Header */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
            Competitions & Y-Court System
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto animate-fade-in">
            Nigeria's Unique Three-Team Competition Format
          </p>
        </div>
      </section>

      {/* Y-Court System Overview */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The <span className="text-primary">Y-Court</span> System
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A revolutionary three-team format that makes rope skipping more dynamic and innovative
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="hover-elevate transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-6 w-6 text-primary" />
                  3 Teams Compete
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Unlike traditional one-on-one formats, three teams compete simultaneously on the Y-Court's three stations, making every match more exciting and strategic.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-6 w-6 text-primary" />
                  3 Stations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The Y-Court features three stations (A, B, C) with teams rotating anti-clockwise after each discipline, ensuring fair competition across all positions.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-primary" />
                  10 Disciplines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Each match consists of 10 different rope skipping disciplines, testing various skills and techniques across different Match Arrangement Options (MAO).
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Scoring System */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Scoring System Explained</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Badge variant="default">SP</Badge> Score Points
                </h4>
                <p className="text-muted-foreground">
                  Direct points earned by athletes during each discipline based on their performance within the set time.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Badge variant="default">DP</Badge> Discipline Points
                </h4>
                <p className="text-muted-foreground">
                  Points awarded to teams based on their Score Points ranking: Highest SP gets the most DP, second gets middle DP, lowest gets least DP. Not all disciplines award the same DP!
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Badge variant="default">TDP</Badge> Total Discipline Points
                </h4>
                <p className="text-muted-foreground">
                  Sum of all Discipline Points earned across all 10 disciplines. Used to determine final match ranking.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Badge variant="default">GP</Badge> Game Points
                </h4>
                <p className="text-muted-foreground">
                  Final match points: Highest TDP = 3 GP, Second TDP = 1 GP, Lowest TDP = 0 GP. These determine league standings.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Match Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Match Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <p className="font-semibold">8 Players Per Team</p>
                  <p className="text-sm text-muted-foreground">Each player competes in minimum 1, maximum 3 disciplines</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <p className="font-semibold">Anti-Clockwise Rotation</p>
                  <p className="text-sm text-muted-foreground">Teams rotate stations after each discipline: A→C, B→A, C→B</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <p className="font-semibold">Chief Judge & Station Judges</p>
                  <p className="text-sm text-muted-foreground">CJ oversees the match, SJs manage each station with Assistant Judges</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
                <div>
                  <p className="font-semibold">Protest System</p>
                  <p className="text-sm text-muted-foreground">Managers can protest (3 max per match, 2-minute window)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">5</div>
                <div>
                  <p className="font-semibold">Time Out</p>
                  <p className="text-sm text-muted-foreground">5-minute break at the middle of Match Arrangement Option (MAO)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">6</div>
                <div>
                  <p className="font-semibold">Tug of War Tiebreaker</p>
                  <p className="text-sm text-muted-foreground">Used when teams tie on TDP - serves as penalty shootout</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Championship Types */}
      <section className="py-16 bg-accent/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Types of <span className="text-primary">Championships</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover-elevate transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Trophy className="h-7 w-7 text-primary" />
                  Standard Match
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Official NRSF matches with full Y-Court system, 8 players per team, 10 disciplines, complete scoring with SP, DP, TDP, and GP. For professional and amateur clubs.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>3 teams compete simultaneously</li>
                  <li>Players must have NRSF ID</li>
                  <li>Full judging crew with CJ and SJs</li>
                  <li>League standings based on GP</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Award className="h-7 w-7 text-primary" />
                  Sub-Standard Match
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  School-level competitions with modified rules. Separate sets of disciplines for primary and secondary schools, focusing on development and participation.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Interschool championships</li>
                  <li>Age-appropriate disciplines</li>
                  <li>Development-focused judging</li>
                  <li>Medal awards for participants</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calendar className="h-7 w-7 text-primary" />
                  Open Championship
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Individual events open to all registered athletes. Features various rope skipping disciplines with individual medals and recognition.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Individual competition format</li>
                  <li>Multiple event categories</li>
                  <li>Open to all skill levels</li>
                  <li>Medal ceremonies for winners</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-7 w-7 text-primary" />
                  Grand Master Contest
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Elite-level individual competitions for experienced athletes. Features advanced disciplines and techniques for master-level competitors.
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Advanced skill requirements</li>
                  <li>Master-level disciplines</li>
                  <li>Elite athlete recognition</li>
                  <li>Special awards and titles</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
