"use client"

import { ChevronRight, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Subject } from "@/lib/dashboard-data"

export function SubjectsGrid({ subjects } : { subjects: Subject[]}) {
  return (
    <section aria-labelledby="subjects-heading">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 id="subjects-heading" className="text-lg font-semibold">
            Your Subjects
          </h2>
          <Badge variant="secondary" className="rounded-full">
            {subjects.length}
          </Badge>
        </div>
        <Button variant="ghost" size="sm" className="gap-1 rounded-xl text-xs">
          <Plus className="size-4" />
          Add Subject
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {subjects.map((subject) => (
          <article
            key={subject.id}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-md cursor-pointer"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5"
              style={{ backgroundColor: subject.colour }}
            />

            <div className="pt-2">
              <div className="mb-3 flex items-start justify-between">
                <div
                  className="size-3 rounded-full"
                  style={{ backgroundColor: subject.colour }}
                  aria-hidden="true"
                />
                <ChevronRight className="size-4 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground" />
              </div>

              <h3 className="mb-1 font-semibold">{subject.name}</h3>
              <p className="mb-3 text-xs text-muted-foreground">
                {subject.questionCount} questions · {subject.topics.length} topics
              </p>

              {/* <div className="mb-3 space-y-1">
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${subject.progress}%`,
                      backgroundColor: subject.colour,
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-right">
                  {subject.progress}% complete
                </p>
              </div> */}

              <div className="flex flex-wrap gap-1.5">
                {subject.topics.slice(0, 2).map((topic) => (
                  <span
                    key={topic.id}
                    className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {topic.name}
                  </span>
                ))}
                {subject.topics.length > 2 && (
                  <span className="rounded-full border border-border/50 px-2 py-0.5 text-[10px] text-muted-foreground/50">
                    +{subject.topics.length - 2}
                  </span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
