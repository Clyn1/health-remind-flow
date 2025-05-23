
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const generalFormSchema = z.object({
  clinicName: z.string().min(2, { message: "Clinic name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
  logoUrl: z.string().url().optional().or(z.literal("")),
  timezone: z.string().min(1, { message: "Please select a timezone." }),
});

const notificationFormSchema = z.object({
  defaultSmsTemplate: z.string().min(1, { message: "Please select a default SMS template." }),
  defaultEmailTemplate: z.string().min(1, { message: "Please select a default email template." }),
  defaultReminderTiming: z.number().min(1).max(30),
  enableAutomaticReminders: z.boolean(),
  sendRecaps: z.boolean(),
});

const securityFormSchema = z.object({
  twoFactorEnabled: z.boolean(),
  ipAllowList: z.string().optional(),
  sessionTimeout: z.number().min(5).max(120),
  passwordMinLength: z.number().min(8).max(30),
});

const integrationFormSchema = z.object({
  twilioAccountSid: z.string().optional(),
  twilioAuthToken: z.string().optional(),
  twilioPhoneNumber: z.string().optional(),
  smtpHost: z.string().optional(),
  smtpPort: z.string().optional(),
  smtpUser: z.string().optional(),
  smtpPassword: z.string().optional(),
  fromEmail: z.string().email().optional().or(z.literal("")),
});

const SettingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  
  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      clinicName: "HealthClinic",
      email: "contact@healthclinic.com",
      phone: "(555) 123-4567",
      address: "123 Medical Lane, Healthcare City, HC 12345",
      logoUrl: "",
      timezone: "America/New_York",
    },
  });
  
  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      defaultSmsTemplate: "appointment-reminder-sms",
      defaultEmailTemplate: "appointment-reminder-email",
      defaultReminderTiming: 24,
      enableAutomaticReminders: true,
      sendRecaps: false,
    },
  });
  
  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      twoFactorEnabled: false,
      ipAllowList: "",
      sessionTimeout: 60,
      passwordMinLength: 12,
    },
  });
  
  const integrationForm = useForm<z.infer<typeof integrationFormSchema>>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues: {
      twilioAccountSid: "",
      twilioAuthToken: "",
      twilioPhoneNumber: "",
      smtpHost: "",
      smtpPort: "",
      smtpUser: "",
      smtpPassword: "",
      fromEmail: "",
    },
  });
  
  const onGeneralSubmit = (data: z.infer<typeof generalFormSchema>) => {
    toast({
      title: "General settings updated",
      description: "Your clinic settings have been updated successfully.",
    });
    console.log(data);
  };
  
  const onNotificationSubmit = (data: z.infer<typeof notificationFormSchema>) => {
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
    console.log(data);
  };
  
  const onSecuritySubmit = (data: z.infer<typeof securityFormSchema>) => {
    toast({
      title: "Security settings updated",
      description: "Your security settings have been updated successfully.",
    });
    console.log(data);
  };
  
  const onIntegrationSubmit = (data: z.infer<typeof integrationFormSchema>) => {
    toast({
      title: "Integration settings updated",
      description: "Your integration settings have been updated successfully.",
    });
    console.log(data);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure your clinic's basic information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={generalForm.control}
                      name="clinicName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clinic Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="timezone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Timezone</FormLabel>
                          <FormControl>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              {...field}
                            >
                              <option value="America/New_York">Eastern Time (ET)</option>
                              <option value="America/Chicago">Central Time (CT)</option>
                              <option value="America/Denver">Mountain Time (MT)</option>
                              <option value="America/Los_Angeles">Pacific Time (PT)</option>
                              <option value="Pacific/Honolulu">Hawaii Time (HT)</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={generalForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={generalForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalForm.control}
                    name="logoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter the URL of your clinic's logo image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save General Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when reminders are sent to patients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={notificationForm.control}
                      name="defaultSmsTemplate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default SMS Template</FormLabel>
                          <FormControl>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              {...field}
                            >
                              <option value="appointment-reminder-sms">Appointment Reminder</option>
                              <option value="confirmation-sms">Appointment Confirmation</option>
                              <option value="follow-up-sms">Follow-up Reminder</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={notificationForm.control}
                      name="defaultEmailTemplate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Default Email Template</FormLabel>
                          <FormControl>
                            <select
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              {...field}
                            >
                              <option value="appointment-reminder-email">Appointment Reminder</option>
                              <option value="confirmation-email">Appointment Confirmation</option>
                              <option value="follow-up-email">Follow-up Reminder</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={notificationForm.control}
                    name="defaultReminderTiming"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Reminder Time (hours before appointment)</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={72} {...field} />
                        </FormControl>
                        <FormDescription>
                          How many hours before an appointment should reminders be sent by default.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="enableAutomaticReminders"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Automatic Reminders</FormLabel>
                          <FormDescription>
                            Automatically send reminders for upcoming appointments.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={notificationForm.control}
                    name="sendRecaps"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Daily Recap Emails</FormLabel>
                          <FormDescription>
                            Send daily recap emails summarizing appointment confirmations and responses.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Notification Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security settings for your account and clinic.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                  <FormField
                    control={securityForm.control}
                    name="twoFactorEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Enable Two-Factor Authentication</FormLabel>
                          <FormDescription>
                            Require a verification code in addition to password for sign in.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="sessionTimeout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Timeout (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" min={5} max={120} {...field} />
                        </FormControl>
                        <FormDescription>
                          How long until inactive users are automatically signed out.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="passwordMinLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Password Length</FormLabel>
                        <FormControl>
                          <Input type="number" min={8} max={30} {...field} />
                        </FormControl>
                        <FormDescription>
                          Minimum number of characters required for user passwords.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="ipAllowList"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IP Address Allowlist</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter one IP address per line"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Restrict access to specific IP addresses. Leave blank to allow all.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Save Security Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
              <CardDescription>
                Connect external services for SMS, email, and other functionality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...integrationForm}>
                <form onSubmit={integrationForm.handleSubmit(onIntegrationSubmit)} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Twilio SMS Configuration</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={integrationForm.control}
                        name="twilioAccountSid"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twilio Account SID</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={integrationForm.control}
                        name="twilioAuthToken"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twilio Auth Token</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={integrationForm.control}
                        name="twilioPhoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Twilio Phone Number</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              The phone number to send SMS messages from.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Email Configuration</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={integrationForm.control}
                        name="smtpHost"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Host</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={integrationForm.control}
                        name="smtpPort"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Port</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={integrationForm.control}
                        name="smtpUser"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={integrationForm.control}
                        name="smtpPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SMTP Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={integrationForm.control}
                        name="fromEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>From Email</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormDescription>
                              The email address that sends email reminders.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <Button type="submit">Save Integration Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
