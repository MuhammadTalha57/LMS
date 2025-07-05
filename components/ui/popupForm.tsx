"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Enhanced field configuration interface
export interface FieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "checkbox";
  placeholder?: string;
  description?: string;
  required?: boolean;
  minLength?: number; // For strings
  maxLength?: number; // For strings
  min?: number; // For numbers
  max?: number; // For numbers
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean;
}

export interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: FieldConfig[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  title?: string;
  description?: string;
  submitButtonText?: string;
}

// Enhanced helper function to create zod schema with proper number validation
function createZodSchema(fields: FieldConfig[]) {
  const schemaFields: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "email":
        fieldSchema = z.string().email("Invalid email address");
        break;
      case "number":
        if (field.required) {
          // For required number fields, first check if it's not empty, then coerce to number
          fieldSchema = z
            .string()
            .min(1, `${field.label} is required`)
            .transform((val) => {
              const num = Number(val);
              if (isNaN(num)) {
                throw new Error(`${field.label} must be a valid number`);
              }
              return num;
            })
            .refine((val) => !isNaN(val), {
              message: `${field.label} must be a valid number`,
            });
        } else {
          // For optional number fields, allow empty string or valid number
          fieldSchema = z
            .string()
            .optional()
            .transform((val) => {
              if (!val || val === "") return undefined;
              const num = Number(val);
              if (isNaN(num)) {
                throw new Error(`${field.label} must be a valid number`);
              }
              return num;
            });
        }

        // Apply number-specific validations after transformation
        if (field.min !== undefined) {
          fieldSchema = fieldSchema.refine(
            (val) => val === undefined || val >= field.min!,
            {
              message: `Must be at least ${field.min}`,
            }
          );
        }
        if (field.max !== undefined) {
          fieldSchema = fieldSchema.refine(
            (val) => val === undefined || val <= field.max!,
            {
              message: `Must be no more than ${field.max}`,
            }
          );
        }
        break;
      case "checkbox":
        fieldSchema = z.boolean();
        break;
      default:
        fieldSchema = z.string();
    }

    // Apply string validations (only for non-number, non-checkbox fields)
    if (field.type !== "number" && field.type !== "checkbox") {
      // For required string fields, ensure they're not empty
      if (field.required) {
        fieldSchema = (fieldSchema as z.ZodString).min(
          1,
          `${field.label} is required`
        );
      }

      if (field.minLength && field.minLength > 1) {
        fieldSchema = (fieldSchema as z.ZodString).min(
          field.minLength,
          `Must be at least ${field.minLength} characters`
        );
      }
      if (field.maxLength) {
        fieldSchema = (fieldSchema as z.ZodString).max(
          field.maxLength,
          `Must be no more than ${field.maxLength} characters`
        );
      }
    }

    // Handle optional fields (for non-number fields)
    if (
      !field.required &&
      field.type !== "checkbox" &&
      field.type !== "number"
    ) {
      fieldSchema = fieldSchema.optional();
    }

    schemaFields[field.name] = fieldSchema;
  });

  return z.object(schemaFields);
}

export function PopupForm({
  open,
  onOpenChange,
  fields,
  onSubmit,
  title = "Add New User",
  description = "Fill in the details to add a new user to the system.",
  submitButtonText = "Add User",
}: AddUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create dynamic schema based on field configs
  const FormSchema = createZodSchema(fields);
  type FormData = z.infer<typeof FormSchema>;

  // Create default values - use empty string for all input types except checkbox
  const defaultValues = fields.reduce((acc, field) => {
    if (field.defaultValue !== undefined) {
      acc[field.name] = field.defaultValue;
    } else if (field.type === "checkbox") {
      acc[field.name] = false;
    } else {
      // Use empty string for all input types (including numbers)
      acc[field.name] = "";
    }
    return acc;
  }, {} as Record<string, any>);

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  async function handleSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderField(field: FieldConfig) {
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            <FormControl>
              {field.type === "textarea" ? (
                <Textarea placeholder={field.placeholder} {...formField} />
              ) : field.type === "select" ? (
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        field.placeholder ||
                        `Select ${field.label.toLowerCase()}`
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "checkbox" ? (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                  <span className="text-sm">
                    {field.description || field.label}
                  </span>
                </div>
              ) : (
                <Input
                  type={field.type === "number" ? "number" : field.type}
                  placeholder={field.placeholder}
                  {...formField}
                  // For number inputs, keep the value as string until validation
                  onChange={(e) => {
                    formField.onChange(e.target.value);
                  }}
                />
              )}
            </FormControl>
            {field.description && field.type !== "checkbox" && (
              <FormDescription>{field.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid gap-4 py-4">{fields.map(renderField)}</div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
